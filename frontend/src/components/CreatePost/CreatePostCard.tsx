import {
  Card, CardContent, Stack, Box, TextField, Button, IconButton, Typography, Tooltip,
  Popover, ToggleButton, ToggleButtonGroup, Chip, Divider,
} from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import { useAuth } from "../../context/AuthContext";
import { useNotify } from "../../app/SnackbarProvider";
import { createPost } from "../../services/posts";

const MAX = 500;

export function CreatePostCard() {
  const { user } = useAuth();
  const notify = useNotify();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLInputElement>(null);
  
  // Post/Poll toggle
  const [mode, setMode] = useState<"post" | "poll">("post");
  
  // Regular post state
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | undefined>();
  
  // Poll state
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollDuration, setPollDuration] = useState<24 | 72 | 168>(24); // hours
  
  // Emoji picker
  const [emojiAnchor, setEmojiAnchor] = useState<null | HTMLElement>(null);

  const mut = useMutation({
    mutationFn: () => {
      if (mode === "post") {
        return createPost({ authorId: user!.id, text: text.trim(), image });
      } else {
        // Poll creation logic
        return createPost({
          authorId: user!.id,
          text: pollQuestion.trim(),
          image: undefined,
        });
      }
    },
    onSuccess: () => {
      setText("");
      setImage(undefined);
      setPollQuestion("");
      setPollOptions(["", ""]);
      notify(mode === "post" ? "Post shared!" : "Poll created!", "success");
      qc.invalidateQueries({ queryKey: ["feed"] });
      qc.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (e: Error) => notify(e.message || "Could not post", "error"),
  });

  const onPick = (f: File | undefined) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return notify("Image too large (max 5MB)", "warning");
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(f);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    if (mode === "post") {
      const cursorPos = textRef.current?.selectionStart || text.length;
      const newText = text.slice(0, cursorPos) + emojiData.emoji + text.slice(cursorPos);
      setText(newText.slice(0, MAX));
    } else {
      setPollQuestion(prev => (prev + emojiData.emoji).slice(0, MAX));
    }
    setEmojiAnchor(null);
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value.slice(0, 100);
    setPollOptions(newOptions);
  };

  if (!user) return null;

  const canPost = mode === "post" 
    ? (text.trim().length > 0 || !!image) && !mut.isPending
    : pollQuestion.trim().length > 0 && pollOptions.filter(o => o.trim()).length >= 2 && !mut.isPending;

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        {/* Mode Toggle */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            icon={<PostAddIcon />}
            label="Create Post"
            onClick={() => setMode("post")}
            color={mode === "post" ? "primary" : "default"}
            variant={mode === "post" ? "filled" : "outlined"}
            sx={{ fontWeight: 700 }}
          />
          <Chip
            icon={<PollOutlinedIcon />}
            label="Create Poll"
            onClick={() => setMode("poll")}
            color={mode === "poll" ? "primary" : "default"}
            variant={mode === "poll" ? "filled" : "outlined"}
            sx={{ fontWeight: 700 }}
          />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Stack direction="row" spacing={2} alignItems="flex-start">
          <UserAvatar src={user.avatar} name={user.name} size={44} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {mode === "post" ? (
              // Regular Post Mode
              <>
                <TextField
                  inputRef={textRef}
                  placeholder="What's on your mind?"
                  multiline
                  minRows={2}
                  maxRows={8}
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, MAX))}
                  variant="standard"
                  InputProps={{ disableUnderline: true, sx: { fontSize: 16 } }}
                  fullWidth
                />
                {image && (
                  <Box sx={{ position: "relative", mt: 1.5, borderRadius: 3, overflow: "hidden" }}>
                    <img src={image} alt="" style={{ width: "100%", display: "block", maxHeight: 420, objectFit: "cover" }} />
                    <IconButton
                      onClick={() => setImage(undefined)}
                      size="small"
                      sx={{
                        position: "absolute", top: 8, right: 8,
                        bgcolor: "rgba(0,0,0,0.55)", color: "white",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </>
            ) : (
              // Poll Mode
              <Stack spacing={2}>
                <TextField
                  placeholder="Ask a question..."
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value.slice(0, MAX))}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
                
                {pollOptions.map((option, index) => (
                  <Stack key={index} direction="row" spacing={1} alignItems="center">
                    <TextField
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updatePollOption(index, e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                    {pollOptions.length > 2 && (
                      <IconButton size="small" onClick={() => removePollOption(index)}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                ))}

                {pollOptions.length < 4 && (
                  <Button
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={addPollOption}
                    size="small"
                    sx={{ alignSelf: "flex-start" }}
                  >
                    Add Option
                  </Button>
                )}

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                    Poll Duration:
                  </Typography>
                  <ToggleButtonGroup
                    value={pollDuration}
                    exclusive
                    onChange={(_, val) => val && setPollDuration(val)}
                    size="small"
                  >
                    <ToggleButton value={24}>24h</ToggleButton>
                    <ToggleButton value={72}>3 Days</ToggleButton>
                    <ToggleButton value={168}>7 Days</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Stack>
            )}
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" sx={{ mt: 2 }} spacing={0.5}>
          {mode === "post" && (
            <Tooltip title="Add image">
              <IconButton color="primary" onClick={() => fileRef.current?.click()}>
                <ImageOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title={emojiAnchor ? "Close emoji picker" : "Add emoji"}>
            <IconButton 
              color="primary" 
              onClick={(e) => setEmojiAnchor(emojiAnchor ? null : e.currentTarget)}
            >
              {emojiAnchor ? <TextFieldsIcon /> : <EmojiEmotionsOutlinedIcon />}
            </IconButton>
          </Tooltip>

          <Popover
            open={Boolean(emojiAnchor)}
            anchorEl={emojiAnchor}
            onClose={() => setEmojiAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <EmojiPicker onEmojiClick={onEmojiClick} width={320} height={400} />
          </Popover>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => onPick(e.target.files?.[0] || undefined)}
          />
          
          <Box sx={{ flex: 1 }} />
          
          {mode === "post" && (
            <Typography variant="caption" color={text.length > MAX - 50 ? "warning.main" : "text.secondary"}>
              {text.length}/{MAX}
            </Typography>
          )}
          
          <Button
            variant="contained"
            disabled={!canPost}
            onClick={() => mut.mutate()}
            endIcon={<SendRoundedIcon />}
            sx={{ ml: 1.5 }}
          >
            {mut.isPending ? "Posting…" : mode === "post" ? "Post" : "Create Poll"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

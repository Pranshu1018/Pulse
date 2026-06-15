import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

export function PageTransition({ children, ...rest }: { children: ReactNode } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

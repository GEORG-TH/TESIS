import React from "react";
import { motion } from "framer-motion";
import "../components/styles/SkeletonRow.css";

export default function SkeletonRow() {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <td colSpan={7}>
        <div className="skeleton-row"></div>
      </td>
    </motion.tr>
  );
}

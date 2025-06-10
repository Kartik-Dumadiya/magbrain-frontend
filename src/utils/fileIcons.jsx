import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileAlt,
  FaFilePowerpoint,
  FaFileCsv,
  FaFile,
  FaGlobe,
} from "react-icons/fa";

export const fileIcons = {
  pdf: <FaFilePdf className="text-red-500" />,
  doc: <FaFileWord className="text-blue-500" />,
  docx: <FaFileWord className="text-blue-500" />,
  xls: <FaFileExcel className="text-green-600" />,
  xlsx: <FaFileExcel className="text-green-600" />,
  csv: <FaFileCsv className="text-green-700" />,
  ppt: <FaFilePowerpoint className="text-orange-500" />,
  pptx: <FaFilePowerpoint className="text-orange-500" />,
  md: <FaFileAlt className="text-gray-700" />,
  txt: <FaFileAlt className="text-gray-700" />,
  html: <FaFileAlt className="text-purple-700" />,
  default: <FaFile className="text-gray-400" />,
  url: <FaGlobe className="text-blue-600" />,
  text: <FaFileAlt className="text-blue-600" />,
};

export function getFileIcon(type, name) {
  if (type === "url") return fileIcons.url;
  if (type === "text") return fileIcons.text;
  const ext = name ? name.split(".").pop().toLowerCase() : "default";
  return fileIcons[ext] || fileIcons.default;
}
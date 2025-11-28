import { Edit } from "lucide-react";

const EditButton = ({ onClick }) => (
  <button onClick={onClick} className="text-gray-500 hover:text-gray-700">
    <Edit size={18} />
  </button>
);

export default EditButton;

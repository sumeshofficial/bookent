import { Edit } from "lucide-react";
import PropTypes from "prop-types";

const EditButton = ({ onClick }) => (
  <button onClick={onClick} className="text-gray-500 hover:text-gray-700">
    <Edit size={18} />
  </button>
);

EditButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default EditButton;

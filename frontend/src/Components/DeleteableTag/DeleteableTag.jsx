import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./DeleteableTag.module.css";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

function DeleteableTag({ file, onDelete }) {
  const handleDelete = (e) => {
    e.preventDefault();
    onDelete();
  };

  return (
    <li className={styles["deleteable-tag"]}>
      <FontAwesomeIcon
        className={styles["delete-icon"]}
        icon={faCircleXmark}
        onClick={handleDelete}
      />
      <p title={file.name}>{file.name}</p>
      <input type="file" style={{ display: "none" }} />
    </li>
  );
}  

export default DeleteableTag;

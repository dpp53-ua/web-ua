import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./DeleteableTag.module.css";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

function DeleteableTag({ file, tag, onDelete }) {
  const handleDelete = (e) => {
    e.preventDefault();
    onDelete();
  };

  const displayName = file ? file.name : tag;

  return (
    <li className={styles["deleteable-tag"]}>
      <FontAwesomeIcon
        className={styles["delete-icon"]}
        icon={faCircleXmark}
        onClick={handleDelete}
      />
      <p title={displayName}>{displayName}</p>
      {file && <input type="file" style={{ display: "none" }} />}
    </li>
  );
}

export default DeleteableTag;

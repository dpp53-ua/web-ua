import { Button, InputField, ProfileMenu} from '../../Components';

/* Estilos */
import styles from "./Profile.module.css";

function Profile() {

return (
    <div className={styles["profile-main-container"]}>
      <section className={styles["left-content"]}>
        <ProfileMenu></ProfileMenu>
      </section>
      <section className={styles["right-content"]}>
      
      </section>
    </div>
  );
}

export default Profile;
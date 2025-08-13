import UserLayout from '@/layouts/userLayouts';
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router';



export default function Home() {

  const router = useRouter()

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>

          <div className={styles.mainContainer__left}>
            <p>Connect with friends without exaggeration.</p>
            <p>A true social media plateform, with stories no blufs !</p>

            <div onClick={() =>{
              router.push('/login')
            }} className={styles.buttonJoin}>
              <p>Join now</p>
            </div>
          </div>


          <div className={styles.mainContainer__right}>
            <img src="images/homemain_connections.jpg" alt="connection Image" />
          </div>

        </div>
      </div>
    </UserLayout>
  );
}

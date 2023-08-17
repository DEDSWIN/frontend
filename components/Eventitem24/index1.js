import styles from "./index1.module.css"
import Image from 'next/image'
const index1 = () =>
{
    return (
        <> <ul className={styles.list1}>
            <li>
                <div className={styles.img}>
                    <Image

                        src="https://th.bing.com/th?q=Potato+Stock+Image&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-IN&cc=IN&setlang=en&adlt=strict&t=1&mw=247"
                        alt="city logo"
                        height="225"
                        width="225" />
                </div>
            </li>
            <li className={styles.info}>
                <div className={styles.cityname}>CITY NAME</div>
                <p className={styles.text}> loerem ipsum dolor</p>

                <ul className={styles.list2}>
                    <li  >
                        <a style={{ textDecoration: "none" }} href="https://www.google.com">
                            <div className={styles.registerbox} >
                                <div className={styles.register}>REGISTER</div>
                            </div>
                        </a>
                    </li>
                    <li style={{ paddingLeft: "94px", paddingTop: "11px" }}>
                        <a href="https://www.google.com">
                            <div className={styles.knowmore}>
                                {"Know more \u2192"}
                            </div>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
        </>
    )
}

export default index1
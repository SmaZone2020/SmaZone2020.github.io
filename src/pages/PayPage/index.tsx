import DefaultLayout from "../../layout/DefaultLayout";
import { useEffect, useRef, useState } from "react";

function Pay() {
    const [text, setText] = useState<string>('');
    const [showImage, setShowImage] = useState<boolean>(false);
    const domT = useRef<HTMLDivElement>(null);

    const isWechatOrAli = () => {
        const ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i)?.toString() === 'micromessenger') {
            setText('微信');
            setShowImage(true);
        } else if (ua.match(/AlipayClient/i)?.toString() === 'alipayclient') {
            setText('支付宝');
            window.location.href = 'https://qr.alipay.com/fkx18308t7bjmkckyaw6of0';
        } else {
            setText('unknown');
        }
    };

    useEffect(() => {
        isWechatOrAli();
    }, []);

    return (
        <DefaultLayout>
            <div id="txt" ref={domT} className="mx-auto text-center">
                {showImage ? (
                    <img src="/wxp.png" alt="微信支付" />
                ) : `正在前往 ${text} 支付页面...`}
            </div>
        </DefaultLayout>
    );
}

export default Pay;





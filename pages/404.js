import { Result, Button } from 'antd';
import Link from 'next/link';

const Custom404 = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Üzgünüz, aradığınız sayfa bulunamadı."
        extra={
          <Link href="/">
            <Button type="primary">Ana Sayfaya Dön</Button>
          </Link>
        }
      />
    </div>
  );
};

export default Custom404;

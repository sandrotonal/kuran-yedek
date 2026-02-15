import React, { useState } from 'react';
import { MenuOutlined, SettingOutlined, BookOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import './KuranAnlamHaritasi.less';

const { Title, Text } = Typography;

const KuranAnlamHaritasi: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);

  // 祈祷时间数据
  const prayerTimes = [
    { name: 'İMSAK', time: '06:27' },
    { name: 'GÜNEŞ', time: '07:52' },
    { name: 'ÖĞLE', time: '13:24' },
    { name: 'İKINDİ', time: '16:18' },
    { name: 'AKŞAM', time: '18:46' },
    { name: 'YATSI', time: '20:06' }
  ];

  // 推荐阅读数据
  const recommendedReadings = [
    {
      title: 'Fatıha Suresi',
      subtitle: 'MEKKİ • 7 AYET',
      arabicText: 'الْفَاتِحَة'
    }
  ];

  return (
    <div className={`kuran-anlam-haritasi ${darkMode ? 'dark' : ''}`}>
      {/* 顶部导航栏 */}
      <header className="header">
        <div className="header-left">
          <MenuOutlined />
          <BookOutlined style={{ color: '#00ff9d', marginLeft: '12px' }} />
          <span className="title">Kur'an Anlam Haritası</span>
        </div>
        <div className="header-right">
          <SettingOutlined />
        </div>
      </header>

      {/* 主要内容 */}
      <main className="main-content">
        {/* 章节信息卡片 */}
        <Card className="chapter-card" hoverable>
          <Row gutter={16}>
            <Col span={12}>
              <div className="chapter-info">
                <div className="label">SURE</div>
                <div className="value">
                  <span className="number">1.</span> Fatıha
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className="chapter-info">
                <div className="label">AYET</div>
                <div className="value">1</div>
              </div>
            </Col>
          </Row>
          <div className="action-button">
            <Button type="link" className="kefet-oku-btn">
              KEŞFET & OKU →
            </Button>
          </div>
        </Card>

        {/* 祈祷时间卡片 */}
        <Card className="prayer-times-card" hoverable>
          <div className="prayer-header">
            <div className="prayer-title">
              <div className="indicator"></div>
              <span>Namaz Vakitleri</span>
            </div>
            <div className="prayer-subtitle">Diyanet Takvimi ile uyumlu</div>
            <div className="prayer-icons">
              <div className="icon-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="icon-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="icon-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="prayer-times-grid">
            {prayerTimes.map((time, index) => (
              <div key={index} className="prayer-time-item">
                <div className="time-name">{time.name}</div>
                <div className="time-value">{time.time}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* 推荐阅读区域 */}
        <div className="recommended-section">
          <Title level={2} className="section-title">Önerilen Okumalar</Title>
          <Text className="section-subtitle">Sık okunan surelere ve ayetlere hızlıca ulaşın</Text>
          
          <div className="recommended-readings">
            {recommendedReadings.map((reading, index) => (
              <Card 
                key={index} 
                className="reading-card"
                hoverable
                cover={
                  <div className="reading-cover">
                    <BookOutlined style={{ color: '#00ff9d', fontSize: '24px' }} />
                    <div className="arabic-text">{reading.arabicText}</div>
                  </div>
                }
              >
                <div className="reading-content">
                  <div className="reading-title">{reading.title}</div>
                  <div className="reading-subtitle">{reading.subtitle}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default KuranAnlamHaritasi;
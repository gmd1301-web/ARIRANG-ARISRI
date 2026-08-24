'use client';

import { DragEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import StudioView from './StudioView';

type View = 'home' | 'about' | 'story' | 'listen' | 'map' | 'studio';
type Instrument = { id: string; name: string; icon: string; src: string; fusion?: boolean };
type Track = { title: string; region: string; version: string; src: string };
const menu: { id: View; label: string }[] = [
  { id: 'about', label: '전시 소개' }, { id: 'story', label: '아리랑 이야기' },
  { id: 'listen', label: '아리랑 감상' }, { id: 'map', label: '아리랑 문화지도' },
  { id: 'studio', label: '참여하기' },
];
const instruments: Instrument[] = [
  { id: 'geomungo', name: '거문고', icon: '▤', src: '/audio/studio/geomungo.wav' },
  { id: 'sogeum', name: '소금', icon: '╱', src: '/audio/studio/sogeum.wav' },
  { id: 'haegeum', name: '해금', icon: '♩', src: '/audio/studio/haegeum.wav' },
  { id: 'gayageum', name: '가야금', icon: '≋', src: '/audio/studio/gayageum.wav' },
  { id: 'janggu', name: '장구', icon: '◉', src: '/audio/studio/janggu.wav' },
  { id: 'kkwaenggwari', name: '꽹과리', icon: '◌', src: '/audio/studio/kkwaenggwari.wav' },
  { id: 'piano', name: '피아노', icon: '▥', src: '/audio/studio/piano.wav', fusion: true },
];
const places = [
  { region: '경기', name: '돈암동 아리랑고개', image: '/images/places/donam.jpg', credit: '서울연구데이터서비스', description: '성북구 돈암동에서 정릉동으로 넘어가는 고갯길의 이름이다. ‘아리랑고개’라는 이름의 유래에 대해서는 홍봉진이 1929년 ‘상춘원’이라는 요리집의 위치를 홍보하기 위해 ‘신흥사(흥천사) 옆 아리랑고개’라는 문구를 사용한 데서 시작되었다는 설, 1930년대 일본인들이 정릉 일대의 아름다운 경치를 이용하여 고급 음식점을 꾸미고 사람들이 많이 알고 있는 ‘아리랑’이라는 이름을 길목에 붙여 널리 알렸다는 설, 1926년 나운규가 발표한 영화「아리랑」의 배경이 되어 널리 알려졌다는 설 등이 있다. 성북구에서는 1997년에 아리랑고개를 ‘영화의 거리’로 조성한다는 계획을 세우고 기념가로수와 테마공원을 조성하는 등 영화의 거리로 특화함으로써 전통과 역사, 문화가 살아 숨 쉬는 명소로 탈바꿈시켰다.' },
  { region: '경기', name: '단성사', image: '/images/places/danseongsa.jpg', credit: '국가기록원 기록물 컬렉션', description: '1926년 10월 1일, 민족의 울분을 분출시켰던 나운규의 ‘아리랑’을 개봉한 것도 단성사다. 나운규 감독·출연의 ‘아리랑’은 일제하에서 민족의 아픔과 설움을 담은 작품이었다. 개봉 첫날부터 유례없는 인기를 끌었고, 종로의 YMCA 건물까지 줄을 서기 일쑤였다. 주연을 맡았던 여배우는 후에 “목 놓아 우는 사람, 아리랑을 합창하는 사람, 심지어 조선 독립 만세를 외치는 사람까지 그야말로 감동의 소용돌이였다.”고 회고했다. 변사의 임기응변에 반일 표현이 섞이기도 해 조선총독부에서 감시했다고 한다. ‘아리랑’은 2년 연속상영이라는 흥행기록을 세웠으며, 감독이며 변사인 김영환이 ‘아리랑’ 주제가를 편곡해 ‘민족의 노래 아리랑’으로 확산시키기도 했다. 이 과정을 통해 단성사는 명실상부 최고의 상설 영화관으로 자리잡았다.' },
  { region: '밀양', name: '밀양 영남루', image: '/images/places/yeongnamru.jpg', credit: '국가유산포털', description: '조선시대 후기 대표적인 목조 건축물이자 밀양아리랑의 역사적 배경이 되는 곳으로, 영남루 아래 아랑각에서 아랑의 영정을 모시고 매년 축제를 엽니다.' },
  { region: '밀양', name: '아랑사당', image: '/images/places/arang-shrine.jpg', credit: '국가유산포털', description: '조선 명종 때 정절을 지키려다 억울하게 죽은 전설의 주인공 아랑(阿娘)을 모신 사당이다. 외모가 뛰어난 밀양 부사의 외동딸 윤동옥은 유모의 꾐에 빠져 영남루(嶺南樓)로 달구경을 갔다가 관청 잔심부름꾼이 겁탈하려고 하자 죽음으로 순결을 지켰다. 이후 밀양에 부임하는 부사마다 첫날밤에 죽는 일이 생겼다. 그러다가 담력이 센 이상사(李上舍)가 신임 부사로 부임해 아랑의 원혼에게서 억울한 사연을 듣고 유모와 잔심부름꾼을 처벌하자 원혼이 다시는 나타나지 않았다고 한다. 밀양 사람들은 아랑의 넋을 위로하기 위해 시신이 발견된 영남루 아래 대밭에 열녀사(烈女祠)라는 사당을 짓고 해마다 제사를 지냈다. 그리고 1930년 영남루를 고쳐 지으면서 ‘정순아랑지비(貞純阿娘之碑)’라는 비석을 세우고 비각을 지어 아랑각이라 불렀다. 이후 1965년에 아랑각을 다시 지으면서 아랑사(阿娘祠)라는 편액을 달았다. 밀양시는 매년 아랑제를 열고 ‘아랑 규수’를 뽑아 나라에서 지내는 제사인 제향을 올린다.' },
  { region: '정선', name: '아우라지', image: '/images/places/auraji.jpg', credit: '정선군청', description: '강원도 정선군 여량면에 위치한 아우라지는 평창의 송천과 삼척의 골지천이 만나 어우러지는 곳으로, 대한민국 대표 민요인 정선아리랑(정선아라리)의 애정편과 뱃사공 가락이 탄생한 유서 깊은 발상지입니다.' },
  { region: '정선', name: '아리랑박물관', image: '/images/places/museum.jpg', credit: '아리랑박물관', description: '아리랑의 역사와 가치를 보존·전시하는 국내 유일의 아리랑 전문 박물관입니다. 2016년에 개관하였으며, 아리랑과 관련된 5천여 점의 다양한 자료를 수집·연구하고 있습니다.' },
  { region: '진도', name: '진도아리랑마을관광지', image: '/images/places/jindo-village.jpg', credit: '진도군청', description: '우리 민족의 한과 얼이 서린 진도아리랑과 전국 팔도의 아리랑을 보고 듣고 체험할 수 있는 문화 공간입니다. 귀성포구 바다가 내려다보이는 아름다운 풍경 속에 자리 잡고 있습니다.' },
  { region: '진도', name: '진도아리랑비', image: '/images/places/jindo.jpg', credit: '국가유산포털', description: '전라남도 진도군 의신면 사천리 첨찰산 남쪽 기슭에는 진도아리랑의 노랫말이 새겨진 진도 아리랑비가 세워져 있다. 진도문화원과 진도아리랑 보존회의 주도로 1995년 8월 15일에 건립되었다. 진도아리랑의 노랫말과 유래, 창법, 장단 등이 새겨져 있으며, 비의 뒤편에는 진도아리랑비를 통해 고된 삶을 달랬던 진도 사람들의 애정을 담아 비를 세우게 되었음을 밝히는 글이 새겨져 있다.' },
];
const tracks: Track[] = [
  { title: '본조아리랑', region: '경기', version: '전통', src: '/audio/listen/bonjo.mp3' },
  { title: '구아리랑', region: '경기', version: '전통', src: '/audio/listen/gug-arirang.mp3' },
  { title: '구아리랑', region: '경기', version: '피아노', src: '/audio/listen/gug-piano.mp3' },
  { title: '밀양아리랑', region: '밀양', version: '전통', src: '/audio/listen/miryang.mp3' },
  { title: '밀양아리랑', region: '밀양', version: '소리꾼', src: '/audio/listen/miryang-singer.mp3' },
  { title: '밀양아리랑', region: '밀양', version: '웅산 가창', src: '/audio/listen/miryang-woongsan.mp3' },
  { title: '정선아리랑', region: '정선', version: '긴아리랑', src: '/audio/listen/jeongseon-long.mp3' },
  { title: '정선아리랑', region: '정선', version: '엮음아리랑', src: '/audio/listen/jeongseon-yeok.mp3' },
  { title: '정선아리랑', region: '정선', version: '뗏목아리랑', src: '/audio/listen/jeongseon-raft.mp3' },
  { title: '진도아리랑', region: '진도', version: '전통', src: '/audio/listen/jindo.mp3' },
  { title: '진도아리랑', region: '진도', version: '장단', src: '/audio/listen/jindo-rhythm.mp3' },
  { title: '진도아리랑', region: '진도', version: '피아노', src: '/audio/listen/jindo-piano.mp3' },
  { title: '아리랑 응원가', region: '현대', version: '국민', src: '/audio/listen/modern-national.mp3' },
  { title: '아리랑 응원가', region: '현대', version: '가야금', src: '/audio/listen/modern-gayageum.mp3' },
  { title: '아리랑 응원가', region: '현대', version: '윤도현 가창', src: '/audio/listen/modern-yoon.mp3' },
];
const storyDescriptions: Record<string, string> = {
  정선: '긴아리랑은 가장 느리고 길게 늘지는 소리입니다. 정선아리랑의 기본이 되는 형태로, 한 마디를 길고 구성지게 뽑아내며 깊은 그리움이나 애절한 감정을 표현합니다.\n\n엮음아리랑은 긴사설(가사)을 빠른 가락으로 촘촘히 엮어서 부르는 소리입니다. 일상생활의 온갖 사연, 재치 있는 이야기, 한탄 등을 숨도 쉴 새 없이 빠르게 쏟아내듯 부르다가 마지막에 높은 소리로 마무리합니다.\n\n뗏목아리랑은 과거 정선 아우라지에서 서울(마포)까지 뗏목을 타고 목재를 운반하던 뱃사공들이 부르던 소리입니다. 거친 물살을 헤치며 나아가던 삶의 애환과 고달픔이 녹아 있는 노동요 성격의 노래입니다.',
  밀양: '세미치 장단에 맞추어 비교적 빠르며 선율이 씩씩하고 경쾌함이 매력적인 밀양아리랑은 영남지역을 대표하는 아리랑 가운데 하나입니다.\n\n빠른 리듬과 내어지르는 특성, 후렴이 앞에 위치하는 급함, 반말투의 첫 사설(날좀 보소, 날좀 보소, 날좀 보소~) 등 영남지역 사람들의 기질이 드러나는 노래입니다.\n\n메나리토리를 바탕으로 한 선율구조를 가지고 있습니다. 라·도·레·미·솔의 5음계로 라에서 시작하여 라로 끝납니다. 힘차게 뻗어나가는 가락을 통해 경상도 민요 특유의 흥을 느낄 수 있습니다.',
  진도: "남도 민요의 진수이자 흥과 한(恨)이 절묘하게 교차하는 진도아리랑을 담은 앨범입니다.\n\n전라도 민요의 시그니처인 '육자배기토리'의 선율을 가지고 있습니다. 떠는 소리, 평으로 내는 소리, 꺾는 소리는 남도 사람들의 고단한 삶의 애환을 달래주는 듯합니다.\n\n가사는 삶의 서러움, 이별의 슬픔, 고단함을 노래하지만, 곡의 전반적인 분위기는 오히려 이를 훌훌 털어버리는 신명 나고 흥겨운 유흥성을 띱니다. 슬픔을 웃음과 흥으로 승화시키는 한국인의 독특한 해학이 담겨 있습니다.",
  경기: '한민족의 희로애락을 담아낸 대표적인 민요인 경기아리랑은 서울·경기 지역을 중심으로 전파되어 오늘날 대중적으로 가장 친숙해진 아리랑입니다.\n\n흔히 경기아리랑을 논할 때 구아리랑과 본조아리랑을 나누어 설명합니다. 구아리랑은 강원도 아라리의 유입 초기 모습이 남아있어 예스러운 멋과 묵직한 애수가 느껴집니다.\n\n본조아리랑은 나운규의 영화 <아리랑> 주제가로 쓰이면서 전 국민적인 애창곡으로 자리 잡았으며, 우리가 보통 “아리랑” 하면 떠올리는 명랑하면서도 슬픈 3박자 가락입니다.',
  해주: '해주아리랑은 그 이름 때문에 황해도 해주 지역에서 불리던 아리랑으로 추정되어 왔으나, 음악적 요소에서 서도소리의 특성이 나타나지 않아 실제 해주에서 생성되고 전승되었는지 확신하기 어렵습니다. 이 곡은 <본조아리랑>이 크게 유행한 이후, 그 영향을 받아 생겨난 여러 아리랑 중 한 곡입니다.\n\n중국 동포가 부른 해주아리랑은 <본조아리랑>과 거의 같은 선율을 지니고 있으며, 남한의 해주아리랑은 <밀양아리랑>과 닮아 있습니다. 또한 서도소리의 음조직이 아닌 경기소리의 음조직으로 불립니다. 아울러 황해도 민요 중에는 이 곡과 유사한 곡이 존재하지 않습니다.',
  공주: '충청남도 공주 지역에서 전승되어 온 토속 민요로, 백제의 옛 역사와 금강의 물결, 그리고 충청도 사람들의 소박하고 유장한 심성이 담겨 있는 소중한 문화유산입니다.\n\n“아리랑 아리랑” 외에도 지역적 특색이 담긴 “아령 아령 아라리야” 같은 독특한 후렴구가 함께 불립니다. 억세지 않고 소박하며, 높고 낮음이 비교적 잔잔하면서도 깊은 정취(유장미)를 지니고 있습니다. 긴소리, 엮음소리, 잦은소리 등 다채로운 형태의 사설로 불립니다.',
};
const Mark = () => <span className="mark" aria-hidden="true">✤</span>;

export default function Home() {
  const [view, setView] = useState<View>('home');
  const [lang, setLang] = useState<'KR' | 'EN'>('KR');
  const [intro, setIntro] = useState(true);
  const [introPlaying, setIntroPlaying] = useState(false);
  const introAudio = useRef<HTMLAudioElement>(null);
  const playerAudio = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => () => { introAudio.current?.pause(); }, []);
  useEffect(() => { if (!intro) { introAudio.current?.pause(); setIntroPlaying(false); } }, [intro]);
  useEffect(()=>{if(view==='studio'&&playerAudio.current){playerAudio.current.pause();setPlaying(false)}},[view]);
  const navigate = (next: View) => { introAudio.current?.pause(); setIntroPlaying(false); setIntro(false); setView(next); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const toggleIntroAudio = async () => { const a = introAudio.current; if (!a) return; if (a.paused) { await a.play(); setIntroPlaying(true); } else { a.pause(); setIntroPlaying(false); } };
  const selectTrack = async (index: number) => { setTrackIndex(index); setPlaying(true); window.setTimeout(() => playerAudio.current?.play(), 0); };
  const togglePlayer = async () => { const a = playerAudio.current; if (!a) return; if (a.paused) { await a.play(); setPlaying(true); } else { a.pause(); setPlaying(false); } };
  const stepTrack = (delta: number) => { if (trackIndex === null) return; selectTrack((trackIndex + delta + tracks.length) % tracks.length); };
  return <main className="site-shell">
    <audio ref={introAudio} src="/audio/listen/bonjo.mp3" loop autoPlay />
    {intro && <section className="intro" aria-label="아리랑 전시 인트로"><div className="intro-moon" /><p>우리의 노래, 우리의 이야기</p><h1>아리랑</h1><span className="intro-rule">✦</span><p className="intro-copy">한민족의 삶과 희로애락이 흐르는 오래된 노래를 만나보세요.</p><div className="intro-shortcuts"><button onClick={() => navigate('story')}><span>⌁</span>아리랑 이야기</button><button onClick={() => navigate('listen')}><span>♫</span>아리랑 감상</button><button onClick={() => navigate('map')}><span>🗺</span>아리랑 문화지도</button><button onClick={() => navigate('studio')}><span>♬</span>참여하기</button></div><div className="intro-actions"><button onClick={() => navigate('home')}>전시 시작하기</button></div><button className="skip" onClick={() => navigate('home')}>인트로 건너뛰기 →</button></section>}
    {!intro && <>{view !== 'home' && view !== 'studio' && <header className="topbar"><button className="brand" onClick={() => navigate('home')} aria-label="아리랑 홈"><Mark /><span>아리랑</span><small>ARIRANG ARCHIVE</small></button><nav aria-label="주 메뉴">{menu.map(item => <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => navigate(item.id)}>{item.label}</button>)}</nav><button className="language" onClick={() => setLang(lang === 'KR' ? 'EN' : 'KR')}>{lang} <span>/ {lang === 'KR' ? 'EN' : 'KR'}</span></button></header>}
      {view === 'home' && <HomeView onNavigate={navigate} />}{view === 'about' && <AboutView onClose={() => navigate('home')} />}{view === 'story' && <StoryView onClose={() => navigate('home')} />}{view === 'listen' && <ListenView onClose={() => navigate('home')} current={trackIndex} onSelect={selectTrack} />}{view === 'map' && <MapView onClose={() => navigate('home')} />}{view === 'studio' && <StudioView onClose={() => navigate('home')} />}
      {trackIndex !== null && view !== 'studio' && <div className="mini-player"><audio ref={playerAudio} key={tracks[trackIndex].src} src={tracks[trackIndex].src} autoPlay onEnded={() => stepTrack(1)} /><div><small>{tracks[trackIndex].region}아리랑</small><b>{tracks[trackIndex].title} · {tracks[trackIndex].version}</b></div><button onClick={() => stepTrack(-1)} aria-label="이전 곡">◀</button><button onClick={togglePlayer} aria-label={playing ? '일시정지' : '재생'}>{playing ? '⏸' : '▶'}</button><button onClick={() => stepTrack(1)} aria-label="다음 곡">▶</button><button onClick={() => { playerAudio.current?.pause(); setTrackIndex(null); setPlaying(false); }} aria-label="플레이어 닫기">×</button></div>}</>}
  </main>;
}

function HomeView({ onNavigate }: { onNavigate: (view: View) => void }) {
  return <div className="home-page"><aside className="side-rail" aria-label="전시 메뉴"><div className="side-emblem"><Mark /><b>아리랑</b><small>우리의 노래, 우리의 이야기</small></div>{menu.map((item,index)=><button key={item.id} onClick={()=>onNavigate(item.id)} className={index===0?'selected':''}><span>{['⌂','⌁','♫','⌖','♙'][index]}</span>{item.label}</button>)}<p>유네스코 인류무형문화유산</p></aside><section className="hero"><div className="sun"/><div className="mountains m1"/><div className="mountains m2"/><div className="plum"><span>❀</span><span>❀</span><span>❀</span><span>❀</span></div><div className="hero-copy"><p>우리의 노래, 우리의 이야기</p><h1>아리랑</h1><div className="ornament">— ✦ —</div><p className="lead">아리랑은 한국인의 삶과 희로애락이 담긴<br/>가장 오래된 노래이자, 마음을 잇는 소중한 유산입니다.</p><button className="frame-button" onClick={()=>onNavigate('about')}>전시 시작하기 <span>›</span></button></div><div className="walker" aria-hidden="true">♙</div><div className="home-cards">{[['story','⌁','아리랑 이야기','지역마다 피어난 여섯 가지 이야기를 만나보세요.'],['listen','♫','아리랑 감상','전통과 현대를 잇는 아리랑을 들어보세요.'],['map','⌖','아리랑 문화지도','노래가 머문 장소를 따라 떠나보세요.'],['studio','♬','참여하기','일곱 악기로 나만의 아리랑을 연주해보세요.']].map(([id,icon,title,body])=><button key={id} onClick={()=>onNavigate(id as View)}><span>{icon}</span><div><b>{title}</b><p>{body}</p></div><i>›</i></button>)}</div></section></div>;
}

function PageHeader({ eyebrow, title, onClose }: { eyebrow: string; title: string; onClose: () => void }) { return <div className="page-heading"><div><p>{eyebrow}</p><h1>{title}</h1></div><button onClick={onClose} aria-label="홈으로 닫기">×</button></div>; }
function AboutView({ onClose }: { onClose: () => void }) { return <section className="content-page"><PageHeader eyebrow="아리랑 소개" title="노래로 이어진 마음" onClose={onClose} /><div className="about-grid"><figure className="poster-panel"><img src="/images/story/arirang-film-poster.jpg" alt="나운규 영화 아리랑 포스터" /><figcaption>영화 〈아리랑〉 포스터</figcaption></figure><article className="source-copy"><Mark /><h2>한국의 대표적인 민요</h2><p>아리랑은 향토민요 또는 통속민요로 불리는 모든 아리랑 계통의 악곡을 일컫는다. 한민족의 정서가 잘 녹아 있고 대중에게도 널리 공유되고 있는 한국의 대표적인 민요이다.</p><p>아리랑은 ‘아리랑, 아리랑, 아라리오’라는 반복되는 구절을 두고서 지역에 따라 다른 내용의 가사가 더해지는 형식으로 발전해 왔다. 강원도의 〈정선아리랑〉, 전라남도의 〈진도아리랑〉, 경상남도의 〈밀양아리랑〉 등 지역별로 특유의 음악어법을 사용해 다양한 곡조로 불리고 있다.</p><p>아리랑의 노랫말에는 사랑, 연인과의 이별, 시집살이의 애환, 외세에 맞선 민족의 투쟁 등 삶의 현장에서 느끼는 희로애락의 감정이 담겨 있다. 노래가 단순한 구조를 띠고 있기 때문에 함께 부르기 쉽고, 즉흥적으로 가사를 바꿀 수 있으며 여러음악 장르에 수용될 수 있는 특징이 있다.</p><p>어느 시대 할 것 없이 위기와 고난의 상황에서 민중과 함께한 아리랑은 삶의 고달픔을 해학적으로 표현하여 그것을 극복해 내려는 갈망을 담고 있다. 오늘날 아리랑은 한반도를 넘어 전 세계의 수많은 지역에서 공동체를 이루어 전승되고 있다. 또한 한류문화의 전 세계 확산과 함께 새로운 문화 콘텐츠로 도약하며 그 특유의 생명력을 표출하고 있다.</p></article></div></section>; }
function StoryView({ onClose }: { onClose: () => void }) { const regions = ['경기','해주','정선','공주','밀양','진도']; const [region, setRegion] = useState('경기'); const index = regions.indexOf(region); return <section className="content-page"><PageHeader eyebrow="아리랑 이야기" title="한반도에 울려 퍼진 노래" onClose={onClose} /><div className="story-grid"><div className="korea-map traditional-map" aria-label="전통 한반도 지역 선택 지도"><img src="/images/story/traditional-korea-map.png" alt="한지와 수묵화 양식으로 표현한 한반도 지도" />{regions.map((r, i) => <button key={r} className={`pin pin-${i} ${region === r ? 'active' : ''}`} onClick={() => setRegion(r)}><span>●</span>{r}</button>)}</div><article className="source-copy"><p className="chapter">지역의 노래 · {index+1} / 6</p><h2>{region}아리랑</h2><p className="preline">{storyDescriptions[region]}</p><div className="story-pager"><button disabled={index===0} onClick={() => setRegion(regions[index-1])}>← 이전</button><span>{index+1} / 6</span><button disabled={index===5} onClick={() => setRegion(regions[index+1])}>다음 →</button></div><div className="region-tabs">{regions.map(r => <button key={r} className={region === r ? 'active' : ''} onClick={() => setRegion(r)}>{r}</button>)}</div></article></div></section>; }
function ListenView({ onClose, current, onSelect }: { onClose: () => void; current: number | null; onSelect: (index: number) => void }) { const [region, setRegion] = useState('경기'); const regions = ['경기','밀양','정선','진도','현대']; return <section className="content-page listen-page"><PageHeader eyebrow="아리랑 감상" title="다시 듣는 오래된 노래" onClose={onClose} /><div className="listen-tabs">{regions.map(r => <button className={region===r?'active':''} onClick={() => setRegion(r)} key={r}>{r}아리랑</button>)}</div><div className="track-grid">{tracks.map((track,index) => track.region === region && <button key={track.src} className={current===index?'active':''} onClick={() => onSelect(index)}><span>{current===index?'⏸':'▶'}</span><div><small>{track.region} · {track.version}</small><b>{track.title}</b></div><i>♪</i></button>)}</div><p className="track-count">총 15곡 · 제공된 실제 음원으로 재생됩니다.</p></section>; }
function MapView({ onClose }: { onClose: () => void }) { const [region, setRegion] = useState('경기'); const regions = ['경기','진도','밀양','정선']; const regionPlaces = places.filter(p => p.region === region); return <section className="content-page"><PageHeader eyebrow="아리랑 문화지도" title="노래가 머문 자리" onClose={onClose} /><div className="map-tabs">{regions.map(r=><button key={r} className={region===r?'active':''} onClick={()=>setRegion(r)}>{r}아리랑</button>)}</div><div className="place-grid">{regionPlaces.map(place=><article className="place-card" key={place.name}><img src={place.image} alt={`${place.name} 전경`} /><div><p className="chapter">{place.region}의 아리랑</p><h2>{place.name}</h2><p>{place.description}</p><small>이미지 출처 · {place.credit}</small></div></article>)}</div></section>; }

function LegacyStudioView({ onClose }: { onClose: () => void }) {
  const [slots, setSlots] = useState<(string | null)[]>(Array(7).fill(null)); const [volume, setVolume] = useState(0.75); const [effect,setEffect]=useState(.2); const [selected,setSelected]=useState<string|null>(null); const [dragging,setDragging]=useState(false); const [paused,setPaused]=useState(false); const audios = useRef<Record<string, HTMLAudioElement>>({});
  useEffect(() => { instruments.forEach(i => { const a = new Audio(i.src); a.loop = true; a.volume = volume; audios.current[i.id] = a; }); return () => Object.values(audios.current).forEach(a => { a.pause(); a.currentTime = 0; }); }, []);
  useEffect(() => { Object.values(audios.current).forEach(a => { a.volume = volume; }); }, [volume]);
  const removeInstrument = (index: number) => { const id=slots[index]; if(!id)return; const a=audios.current[id]; a.pause(); a.currentTime=0; const next=[...slots]; next[index]=null; setSlots(next); };
  const placeInstrument = async (id:string,index?:number) => { if(!id)return; const existing=slots.indexOf(id); const target=index??slots.findIndex(v=>v===null); if(target<0)return; const next=[...slots]; if(existing>=0&&existing!==target)next[existing]=null; const old=next[target]; if(old&&old!==id){audios.current[old].pause();audios.current[old].currentTime=0;} next[target]=id; setSlots(next); const activeId=next.find(v=>v&&v!==id); const a=audios.current[id]; a.currentTime=activeId?audios.current[activeId!].currentTime:0; if(!paused)await a.play(); setSelected(null); };
  const pauseAll=()=>{Object.values(audios.current).forEach(a=>a.pause());setPaused(true)};
  const playAll=async()=>{const ids=slots.filter(Boolean) as string[];const phase=ids.length?audios.current[ids[0]].currentTime:0;for(const id of ids){audios.current[id].currentTime=phase;await audios.current[id].play();}setPaused(false)};
  const stopAll=()=>{Object.values(audios.current).forEach(a=>{a.pause();a.currentTime=0});setPaused(true)};
  const reset=()=>{stopAll();setSlots(Array(7).fill(null));setSelected(null)};
  const drop=(event:DragEvent,index:number)=>{event.preventDefault();setDragging(false);placeInstrument(event.dataTransfer.getData('instrument'),index)};
  const keyboardAdd=(event:KeyboardEvent,id:string)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setSelected(id)}};
  return <section className="studio-built"><header className="studio-built-header"><button onClick={()=>{reset();onClose()}}>← 전시로</button><div><b>아리랑</b><small>ARIRANG STUDIO</small></div><h1><Mark/> 아리랑을 함께 연주해요 <Mark/></h1><button onClick={reset}>구성 초기화 ↻</button></header><div className="studio-controls"><button onClick={playAll}>▶ 전체 재생</button><button onClick={pauseAll}>⏸ 일시정지</button><button onClick={stopAll}>■ 전체 정지</button><label>전체 음량<input type="range" min="0" max="1" step=".05" value={volume} onChange={e=>setVolume(+e.target.value)}/></label><label>울림 효과<input type="range" min="0" max="1" step=".05" value={effect} onChange={e=>setEffect(+e.target.value)}/></label></div><div className={`studio-stage-built ${dragging?'dragging':''}`}><div className="stage-sky"><span className="studio-moon"/><span className="ink-cloud">〰</span><p><Mark/> {slots.filter(Boolean).length} / 7 연주자 참여 중</p></div><div className="character-grid">{slots.map((id,index)=>{const inst=instruments.find(i=>i.id===id);return <div className={`character-card char-${index} ${id&&!paused?'playing':''}`} key={index}><div className="character-portrait" role="img" aria-label={`${index+1}번 한복 연주자`}/><button className={`sound-slot ${dragging||selected?'available':''}`} onDragOver={e=>e.preventDefault()} onDrop={e=>drop(e,index)} onClick={()=>selected?placeInstrument(selected,index):id&&removeInstrument(index)} aria-label={id?`${inst?.name} 배치됨. 눌러 제거`:`${index+1}번 슬롯에 악기 배치`}>{inst?<><span className={`instrument-crop crop-${inst.id}`} role="img" aria-label={inst.name}/><b>{inst.name}</b><small>{paused?'정지됨':'♪ 연주 중'} · 제거</small></>:<><strong>＋</strong><span>악기를<br/>넣어주세요</span></>}</button></div>})}</div><p className="studio-guide">하단 악기를 드래그하거나 선택한 뒤 원하는 연주자 칸을 누르세요.</p></div><section className="instrument-section"><div className="instrument-heading"><b>국악 <small>전통음악</small></b><span>퓨전 <small>현대음악</small></span></div><div className="instrument-grid">{instruments.map((inst,index)=><button key={inst.id} draggable onDragStart={e=>{e.dataTransfer.setData('instrument',inst.id);setDragging(true)}} onDragEnd={()=>setDragging(false)} onClick={()=>setSelected(selected===inst.id?null:inst.id)} onKeyDown={e=>keyboardAdd(e,inst.id)} className={`${inst.fusion?'fusion':''} ${slots.includes(inst.id)?'active':''} ${selected===inst.id?'selected':''}`} aria-pressed={slots.includes(inst.id)}><span className={`instrument-crop tray-crop crop-${inst.id}`} role="img" aria-label={`${inst.name} 이미지`}/><b>{inst.name}</b><small>{slots.includes(inst.id)?'● 사용 중':selected===inst.id?'슬롯을 선택하세요':'드래그 / 선택'}</small></button>)}</div></section></section>;
}


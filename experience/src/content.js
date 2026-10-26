// All copy and media can be replaced here. Paths are relative to public/.
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
export const content = {
  opening: {
    title: "Light up your routine.",
    subtitle: "일상에 스며드는 작은 빛",
    poster: "media/opening.jpg",
    video: "media/opening-preview.mp4",
    videoWebm: "media/opening-preview.webm",
  },
  story: {
    title: ["A small light.", "A world of difference."],
    body: "하루를 바꾸는 건, 어쩌면 아주 작은 순간.\nLUUM은 당신의 공간과 일상 사이에서\n온전히 나를 위한 시간을 생각합니다.",
    image: "media/story.jpg",
    alt: "부드러운 빛과 패브릭으로 표현한 LUUM 무드 이미지",
  },
  products: [
    {
      id: "01",
      title: "The first light",
      line: "하루를 여는 작은 시작.",
      description:
        "고요한 아침, 나에게 집중하는 순간.\n당신의 첫 번째 루틴을 위한 자리.",
      color: "#e6e5df",
      ink: "#343a35",
      image: "media/product-01.svg",
      layout: "right",
    },
    {
      id: "02",
      title: "A softer rhythm",
      line: "조금 더 부드러운 리듬.",
      description:
        "서두르지 않아도 괜찮은 시간.\n일상의 속도를 천천히 낮춥니다.",
      color: "#d4d9d3",
      ink: "#293e37",
      image: "media/product-02.svg",
      layout: "left",
    },
    {
      id: "03",
      title: "Room to breathe",
      line: "나를 위한 여백.",
      description:
        "익숙한 공간에 새로운 감각을.\n작은 쉼이 일상의 결을 바꿉니다.",
      color: "#e4ded6",
      ink: "#4d4237",
      image: "media/product-03.svg",
      layout: "center",
    },
    {
      id: "04",
      title: "The quiet hour",
      line: "깊어지는 고요.",
      description: "하루의 소음이 잦아드는 시간.\n오롯이 나에게 돌아오는 순간.",
      color: "#5c675f",
      ink: "#faf8f2",
      image: "media/product-04.svg",
      layout: "right",
    },
    {
      id: "05",
      title: "A lingering glow",
      line: "오래 머무는 온기.",
      description:
        "오늘의 작은 순간이 내일로 이어지도록.\n당신의 일상에 은은하게 남습니다.",
      color: "#dad4c9",
      ink: "#3e3c34",
      image: "media/product-05.svg",
      layout: "left",
    },
  ],
  values: {
    title: ["Less, but", "more meaningful."],
    image: "media/values.jpg",
    items: [
      {
        title: "작은 순간의 가치",
        text: "평범한 하루 속, 무심히 지나쳤던 순간에 마음을 기울입니다.",
      },
      {
        title: "감각의 균형",
        text: "보이는 것과 느껴지는 것. 어느 하나 과하지 않은 조화를 생각합니다.",
      },
      {
        title: "오래 곁에 두는 마음",
        text: "빠르게 지나가는 유행보다, 매일 다시 찾게 되는 의미를 지향합니다.",
      },
    ],
  },
};

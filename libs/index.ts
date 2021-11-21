export function getDay(dt: number) {
  const date = new Date(dt * 1000);
  const day = date.getDay();

  switch (day) {
    case 0:
      return "일요일";
    case 1:
      return "월요일";
    case 2:
      return "화요일";
    case 3:
      return "수요일";
    case 4:
      return "목요일";
    case 5:
      return "금요일";
    case 6:
      return "토요일";
  }
}

export function getWeatherConditionalColor(description: string) {
  switch (description) {
    case "Thunderstorm":
      return "rgb(89,121,151)";
    case "Drizzle":
    case "Rain":
      return "rgb(16,42,64)";
    case "Snow":
      return "rgb(88,120,177)";
    case "Mist":
    case "Smoke":
    case "Haze":
    case "Dust":
    case "Fog":
    case "Send":
    case "Dust":
    case "Ash":
    case "Squall":
    case "Torando":
      return "rgb(143,95,76)";
    case "Clouds":
      return "rgb(60,80,112)";
    case "Clear":
    default:
      return "rgb(25,60,115)";
  }
}

export function getHourColor(hour: number) {
  if (hour < 8) return "rgb(50,50,142)";
  else if (hour < 16) return "rgb(230,160,70)";
  else return "rgb(25,40,62)";
}

export const getDirection = (deg: number) => {
  if (deg > 337.5) return "북";
  if (deg > 292.5) return "북서";
  if (deg > 247.5) return "서";
  if (deg > 202.5) return "남서";
  if (deg > 157.5) return "남";
  if (deg > 122.5) return "남동";
  if (deg > 67.5) return "동";
  if (deg > 22.5) {
    return "북동";
  }
  return "북";
};

export const getDate = (dt: number) => {
  const date = new Date(dt * 1000);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const convertHour = ((date.getHours() + 11) % 12) + 1;
  const flag = hour < 13;

  return `${flag ? "오전" : "오후"} ${convertHour}:${minute}`;
};

export const getHour = (dt: number) => {
  const date = new Date(dt * 1000);
  const hour = date.getHours();

  return hour;
};

export const translateWeather = (weather: string) => {
  switch (weather) {
    case "clear sky":
      return "맑은 하늘";
    case "few clouds":
      return "약간의 구름";
    case "scattered clouds":
      return "흐트러진 구름";
    case "broken clouds":
      return "부서진 구름";
    case "shower rain":
      return "소나기";
    case "rain":
      return "비";
    case "thunderstorm":
      return "뇌우";
    case "snow":
      return "눈";
    case "Haze":
    case "mist":
      return "안개";
    default:
      return weather;
  }
};

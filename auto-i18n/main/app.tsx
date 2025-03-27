import { t } from "i18next";
import { useState } from "react";
function App() {
  const [count, setCount] = useState(0);
  const [num, setNum] = useState(0);
  const [age, setAge] = useState(0);
  const [sex, setSex] = useState("female");
  return <div>
      <h1>title</h1>
      <h2>{t("这是一个副标题")}</h2>
      <div>
        <h3>balabala</h3>
        <p>1242nrio3unfiu32nfui</p>
        <p>{t("恶吻吻吻吻吻哥哥哥哥")}</p>
      </div>
      <div>{count}</div>
      <button onClick={() => setCount(count => count + 1)}>{t("增加")}</button>
      <button onClick={() => setCount(count => count - 1)}>{t("减小")}</button>
    </div>;
}
export default App;
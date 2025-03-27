import { t } from "i18next";
import { useState } from 'react';
import './App.css';
function App() {
  const [count, setCount] = useState(0);
  return <div>
      <div>{count}</div>
      <button onClick={() => setCount(count => count + 1)}>{t("增")}{count}{t("加")}</button>
      <button onClick={() => setCount(count => count - 1)}>{t("减小")}</button>
      <p>{t("哈哈哈哈哈哈哈哈哈")}</p>
      <App v={t("哈哈哈哈哈哈哈哈哈")} />
    </div>;
}
export default App;
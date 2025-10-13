import { BrowserRouter, Routes, Route } from "react-router-dom";
import appRoutes from "./utils/routes";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {appRoutes.map((route, i) => (
          <Route key={i} path={route.path} element={route.element}>
            {route.children?.map((child, j) =>
              child.index ? (
                <Route key={j} index element={child.element} />
              ) : (
                <Route key={j} path={child.path} element={child.element} />
              )
            )}
          </Route>
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default App;

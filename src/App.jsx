import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import appRoutes from "./utils/routes";

const App = () => {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
};

export default App;

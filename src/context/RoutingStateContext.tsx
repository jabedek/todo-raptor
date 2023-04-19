import { RoutingState } from "@@types/common";
import { createContext, useState, useEffect, useContext } from "react";
import { useNavigation, useLocation } from "react-router-dom";

const RoutingStateContext = createContext<RoutingState>({ location: "", state: "idle" });

type Props = {
  children: React.ReactNode;
};

const RoutingStateProvider: React.FC<Props> = ({ children }: any) => {
  const [routingState, setroutingState] = useState<RoutingState>({ location: "", state: "idle" });
  const navigation = useNavigation();
  const location = useLocation();

  useEffect(() => {
    setroutingState({ state: navigation.state, location: location.pathname });
  }, [navigation.state, location.pathname]);

  return (
    <>
      <RoutingStateContext.Provider value={{ location: routingState?.location, state: routingState?.state }}>
        {children}
      </RoutingStateContext.Provider>
    </>
  );
};

function useRoutingStateValue() {
  return useContext(RoutingStateContext);
}

export { RoutingStateContext, RoutingStateProvider, useRoutingStateValue };

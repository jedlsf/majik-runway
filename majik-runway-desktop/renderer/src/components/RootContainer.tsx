import styled from "styled-components";
import { type ReactNode } from "react";

const Root = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export default function RootContainer({ children }: { children?: ReactNode }) {
  return <Root>{children}</Root>;
}

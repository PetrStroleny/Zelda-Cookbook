import styled from "@emotion/styled";
import { FC } from "react";
interface PageHeaderProps {
   children: string
   trailing?: JSX.Element
}

const PageHeader: FC<PageHeaderProps> = ({children, trailing}) => (
   <Wrapper>
      <H1>{children}</H1>
      {trailing}
   </Wrapper>
);

const Wrapper = styled("div")`
   display: flex;
   align-items: center;
   justify-content: space-between;
`;

const H1 = styled("h1")`
   ${p => p.theme.fontStyles.h1};
   color: ${p => p.theme.content.primary};
`;

export default PageHeader;
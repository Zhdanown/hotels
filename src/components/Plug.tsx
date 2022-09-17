import React, { FC, SVGProps } from "react";
import styled from "styled-components";
import { Centered } from "./Centered";
import { SvgIcon } from "./SvgIcon";

type SVG = FC<SVGProps<SVGSVGElement>>;

const Title = styled.span`
  font-size: 2rem;
`;

type IconFontSize = `${number}${'rem' | 'px'}`;

const Icon = ({ component, iconFontSize }: { component: SVG, iconFontSize?: IconFontSize }) => (
  <SvgIcon component={component} style={{ fontSize: iconFontSize || '10rem' }} />
);

export const Plug = ({ title, icon, iconFontSize }: {title: string; icon: SVG; iconFontSize?: IconFontSize }) => (
  <Centered column>
    <Title>{title}</Title>
    {icon && <Icon component={icon} iconFontSize={iconFontSize} />}
  </Centered>
);

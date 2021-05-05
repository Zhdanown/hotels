import React from "react";
import styled from "styled-components";
import Icon from "@ant-design/icons";

import { ReactComponent as Carpet_ } from "../assets/feature_icons/carpet.svg";
import { ReactComponent as Chair_ } from "../assets/feature_icons/chair-solid.svg";
import { ReactComponent as Coffee_ } from "../assets/feature_icons/coffee-cup.svg";
import { ReactComponent as Ironing_ } from "../assets/feature_icons/ironing.svg";
import { ReactComponent as FlipFlops_ } from "../assets/feature_icons/flip-flops.svg";
import { ReactComponent as MiniBar_ } from "../assets/feature_icons/miniBar.svg";
import { ReactComponent as Hairdryer_ } from "../assets/feature_icons/hairdryer.svg";
import { ReactComponent as Iron_ } from "../assets/feature_icons/electric-iron.svg";
import { ReactComponent as Kettle_ } from "../assets/feature_icons/kettle.svg";
import { ReactComponent as AC_ } from "../assets/feature_icons/ac.svg";
import { ReactComponent as Shower_ } from "../assets/feature_icons/shower-solid.svg";
import { ReactComponent as Table_ } from "../assets/feature_icons/table.svg";
import { ReactComponent as Toilet_ } from "../assets/feature_icons/toilet-solid.svg";
import { ReactComponent as TV_ } from "../assets/feature_icons/tv-solid.svg";
import { ReactComponent as TwoBeds_ } from "../assets/feature_icons/two-single-beds-and-a-table.svg";
import { ReactComponent as View_ } from "../assets/feature_icons/view.svg";
import { ReactComponent as Wardrobe_ } from "../assets/feature_icons/wardrobe.svg";
import { ReactComponent as Water_ } from "../assets/feature_icons/water.svg";
import { ReactComponent as Wifi_ } from "../assets/feature_icons/wifi-solid.svg";
import Accordion, {
  Title,
  Icon as AccordionIcon,
} from "../components/Accordion";
import { useSelector } from "react-redux";
import { getRoomIcons } from "./roomsReducer";

export const SvgIcon = ({ component, style }) => (
  <Icon component={component} style={style} />
);

SvgIcon.defaultProps = {
  style: {
    fontSize: "1.5rem",
  },
};

const Carpet = props => <SvgIcon component={Carpet_} {...props} />;
const Chair = props => <SvgIcon component={Chair_} {...props} />;
const Coffee = props => <SvgIcon component={Coffee_} {...props} />;
const Iron = props => <SvgIcon component={Iron_} {...props} />;
const FlipFlops = props => <SvgIcon component={FlipFlops_} {...props} />;
const MiniBar = props => <SvgIcon component={MiniBar_} {...props} />;
const Hairdryer = props => <SvgIcon component={Hairdryer_} {...props} />;
const Ironing = props => <SvgIcon component={Ironing_} {...props} />;
const Kettle = props => <SvgIcon component={Kettle_} {...props} />;
const AC = props => <SvgIcon component={AC_} {...props} />;
const Shower = props => <SvgIcon component={Shower_} {...props} />;
const Table = props => <SvgIcon component={Table_} {...props} />;
const Toilet = props => <SvgIcon component={Toilet_} {...props} />;
const TV = props => <SvgIcon component={TV_} {...props} />;
const TwoBeds = props => <SvgIcon component={TwoBeds_} {...props} />;
const View = props => <SvgIcon component={View_} {...props} />;
const Wardrobe = props => <SvgIcon component={Wardrobe_} {...props} />;
const Water = props => <SvgIcon component={Water_} {...props} />;
const Wifi = props => <SvgIcon component={Wifi_} {...props} />;

const iconsMap = {
  wifi: Wifi,
  tv: TV,
  shower: Shower,
  toilet: Toilet,
  flipFlops: FlipFlops,
  carpet: Carpet,
  chair: Chair,
  coffee: Coffee,
  iron: Iron,
  miniBar: MiniBar,
  hairdryer: Hairdryer,
  ironing: Ironing,
  kettle: Kettle,
  ac: AC,
  table: Table,
  twoBeds: TwoBeds,
  view: View,
  wardrobe: Wardrobe,
  water: Water
}
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media screen and (max-width: 425px) {
    grid-template-columns: 1fr;
  }

  @media screen and (min-width: 1024px) and (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export default function RoomFeatures() {
  const icons = useSelector(getRoomIcons)

  return (
    <div style={{ margin: "1rem 0" }}>
      <Container>
        <FeatureItem title="Wifi" icon={Wifi} />
        <FeatureItem title="Телевизор" icon={TV} />
      </Container>

      <Accordion
        renderTitleAfter={(toggle, open) => (
          <Title onClick={toggle} style={{ justifyContent: "center" }}>
            <span>{open ? "Скрыть" : "Подробнее"}</span>
            <AccordionIcon open={open} />
          </Title>
        )}
      >
        {Object.entries(icons).reduce(splitByChunksOfTwo, []).map(chunk => (
          <Container>
            {chunk.map(([icon, iconLabel]) => (
              <FeatureItem title={iconLabel} icon={iconsMap[icon]} />
            ))}
          </Container>
        ))}
      </Accordion>
    </div>
  );
}

function splitByChunksOfTwo(resultArray, item, index) {
  const chunkIndex = Math.floor(index / 2)
  if (!resultArray[chunkIndex]) {
    resultArray[chunkIndex] = [];
  }
  resultArray[chunkIndex].push(item)
  return resultArray
}

const StyledFeatureItem = styled.div`
  display: inline-flex;
  align-items: center;

  span {
    margin-left: 0.5rem;
  }
`;

function FeatureItem({ title = "test", icon = Wifi }) {
  return (
    <StyledFeatureItem>
      {icon()}
      <span>{title}</span>
    </StyledFeatureItem>
  );
}

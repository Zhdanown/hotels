import styled from "styled-components";
import { Centered } from "../../components/Centered";

export const StyledRoom = styled.section`
  margin: 1rem 0;
`;

export const RoomHeader = styled(Centered)`
  margin-bottom: 0.5rem;
`;

export const StyledCategory = styled(Centered)`
  background: white;
  padding: 0.5rem;
  border-bottom: 1px solid #dddddd;
  &:last-child {
    border: none;
  }
`;

export const CategoryName = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
`;

export const CategoryLabel = styled.label`
  margin-bottom: 0;
  font-weight: bold;
`;

export const CounterValue = styled.span`
  margin: 0 0.5rem;
  font-size: 1.4rem;
  display: inline-block;
  width: 3rem;
  text-align: center;
`;

function hexToRgb(hex = "#aaaaaa", opacity) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `${r},${g},${b}, ${opacity}`;
}

export const CounterButton = styled.button`
  border: none;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  background: white;
  transition: background 0.2s;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: rgba(${props => hexToRgb(props.color, 0.3)});
  }
`;

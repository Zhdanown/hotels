import styled from "styled-components";
import { hexToRgb, withOpacity } from "../../hexToRgb";
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
    background: rgba(${props => withOpacity(hexToRgb(props.primaryColor), 0.3)});
  }
`;

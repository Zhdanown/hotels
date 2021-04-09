import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import LayoutContext from "../Layout/LayoutContext";
import RoomShowcase from "./RoomShowcase";
import Button from "../components/Button";
import ColumnHeader from "../components/ColumnHeader";

import { getRoomLoadError, getRooms, getExtraServices } from "./roomsReducer";
import { changeParams } from "../redux/booking";
import { Error } from "../components/Input";
import ExtraService from "./ExtraService";
import produce from "immer";

const StyledServices = styled.div``;

function Rooms({ onSelect, goBack }) {
  const rooms = useSelector(getRooms);
  const roomsLoadError = useSelector(getRoomLoadError);

  return (
    <div style={{ position: "relative" }}>
      <ColumnHeader goBack={goBack}>Выбор номера</ColumnHeader>
      {rooms.map(room => (
        <RoomShowcase
          key={room.id}
          room={room}
          onSelect={onSelect}
        ></RoomShowcase>
      ))}
      {roomsLoadError && <Error discreet>{roomsLoadError.message}</Error>}
    </div>
  );
}

function RoomsWithExtraServices() {
  const extraServices = useSelector(getExtraServices);
  const [selectedRoomAndRate, setSelected] = useState(null);
  const [services, setServices] = useState([]);

  const { setStep } = useContext(LayoutContext);
  const dispatch = useDispatch();

  const headerRef = React.createRef();
  const [scrolled, setScrolled] = useState(false);

  const continueBooking = () => {
    setStep(step => ++step);
    dispatch(changeParams(selectedRoomAndRate));
  };

  useEffect(() => {
    if (headerRef.current && !scrolled) {
      headerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setScrolled(true);
    }
  }, [headerRef, scrolled]);

  const onSelect = data => {
    setSelected(data);
    if (!extraServices.length) {
      // skip extraServices
      continueBooking();
    }
  };

  const cancelServices = () => {
    setSelected(null);
    setScrolled(false);
  };

  const goStepBack = () => {
    setStep(step => --step);
  };

  useEffect(() => {
    const selectedServices = services.filter(x => x.selected);
    dispatch(changeParams({ packages: selectedServices }));
  }, [services, dispatch]);

  const updateSelectedServices = useCallback(
    service => {
      if (services.find(x => x.id === service.id)) {
        setServices(
          produce(draft => {
            const index = draft.findIndex(x => x.id === service.id);
            if (index !== -1) draft[index].selected = service.selected;
          })
        );
      } else {
        setServices(prev => [...prev, service]);
      }
    },
    [services]
  );

  if (selectedRoomAndRate && extraServices.length) {
    return (
      <>
        <ColumnHeader goBack={cancelServices} ref={headerRef}>
          Дополнительные услуги
        </ColumnHeader>
        <StyledServices>
          {extraServices.map(service => (
            <ExtraService
              key={service.id}
              {...service}
              onSelect={updateSelectedServices}
            />
          ))}
        </StyledServices>
        <div style={{ margin: "1rem 0" }}>
          <Button small onClick={continueBooking}>
            Продолжить бронирование
          </Button>
        </div>
      </>
    );
  }
  return <Rooms onSelect={onSelect} goBack={goStepBack} />;
}

export default RoomsWithExtraServices;

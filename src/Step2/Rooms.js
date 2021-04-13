import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import LayoutContext from "../Layout/LayoutContext";
import RoomShowcase from "./RoomShowcase";
import Button from "../components/Button";
import ColumnHeader from "../components/ColumnHeader";

import {
  getRoomLoadError,
  getRooms,
  getExtraServices,
  getRoomsLoadState,
} from "./roomsReducer";
import { changeParams } from "../redux/booking";
import { Error } from "../components/Input";
import ExtraService from "./ExtraService";
import produce from "immer";
import { Centered, Justified } from "../components/Centered";
import Loader, { LoaderWrapper } from "../components/Loader";
import styled from "styled-components";
import Accordion, { Icon, Title } from "../components/Accordion";
import { getPrimaryColor } from "../redux/hotelConfig";

function RoomsWithExtraServices() {
  const extraServices = useSelector(getExtraServices);
  const [selectedRoomAndRate, setSelected] = useState(null);
  const [services, setServices] = useState([]);

  const serivicesByCategories = [...extraServices]
    .sort((a, b) => {
      if (!a.category) {
        return 1;
      }
      return -1;
    })
    .reduce((acc, service) => {
      const { category } = service;

      const newCategory = acc[category]
        ? [...acc[category], service]
        : [service];
      acc = { ...acc, [category]: newCategory };

      return acc;
    }, {});

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
        <div>
          {Object.keys(serivicesByCategories).map((categoryName, i) => (
            <ServiceCategory
              key={i}
              services={serivicesByCategories[categoryName]}
              categoryName={categoryName}
              updateSelectedServices={updateSelectedServices}
            />
          ))}
          {/* {extraServices.map(service => (
            <ExtraService
              key={service.id}
              {...service}
              onSelect={updateSelectedServices}
            />
          ))} */}
        </div>
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

function ServiceCategory({ services, categoryName, updateSelectedServices }) {
  const color = useSelector(getPrimaryColor);

  if (!services) {
    return null;
  } else if (categoryName === "null") {
    return services.map(service => (
      <ExtraService
        key={service.id}
        {...service}
        onSelect={updateSelectedServices}
      />
    ));
  } else
    return (
      <Accordion
        renderTitle={(toggle, open) => (
          <Title onClick={toggle} color={color}>
            {categoryName} <Icon open={open} />
          </Title>
        )}
      >
        {services.map(service => (
          <ExtraService
            key={service.id}
            {...service}
            onSelect={updateSelectedServices}
          />
        ))}
      </Accordion>
    );
}

function Rooms({ onSelect, goBack }) {
  const rooms = useSelector(getRooms);
  const isLoadingRooms = useSelector(getRoomsLoadState);
  const roomsLoadError = useSelector(getRoomLoadError);

  if (isLoadingRooms) {
    return <LoadScreen />;
  } else if (roomsLoadError) {
    return (
      <FallbackMessage goBack={goBack}>
        <Error>{roomsLoadError}</Error>
      </FallbackMessage>
    );
  } else if (!rooms.length && !isLoadingRooms) {
    return (
      <FallbackMessage goBack={goBack}>
        По заданным параметрам ничего не найдено
      </FallbackMessage>
    );
  }

  if (rooms.length) {
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
      </div>
    );
  }

  return null;
}

function FallbackMessage({ goBack, children }) {
  return (
    <Centered column alignV="center">
      <Justified style={{ textAlign: "center", marginBottom: "1rem" }}>
        {children}
      </Justified>
      <Button onClick={goBack}>Изменить параметры поиска</Button>
    </Centered>
  );
}

function LoadScreen() {
  return (
    <Centered column alignV="center">
      <FallbackTitle>Загрузка номеров</FallbackTitle>
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    </Centered>
  );
}

const FallbackTitle = styled(Justified)`
  text-align: center;
  margin-bottom: 1rem;
  font-size: 2rem;
`;

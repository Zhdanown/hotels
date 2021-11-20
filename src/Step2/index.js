import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import produce from "immer";

import Rooms from "./Rooms";
import ExtraServicesList from "./ExtraServiceList";
import { getExtraServices } from "./roomsReducer";
import { changeParams } from "../redux/booking";
import LayoutContext from "../Layout/LayoutContext";

function RoomsWithExtraServices() {
  const extraServices = useSelector(getExtraServices);
  const [selectedRoomAndRate, setSelected] = useState(null);
  const [services, setServices] = useState([]);

  const { setStep } = useContext(LayoutContext);
  const dispatch = useDispatch();

  const headerRef = React.createRef();
  const [scrolled, setScrolled] = useState(false);

  const continueBooking = () => {
    dispatch(changeParams(selectedRoomAndRate));
    setStep(step => ++step);
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

  useEffect(() => {
    // skip extraServices step
    if (selectedRoomAndRate && !extraServices.length) {
      continueBooking();
    }
  }, [extraServices, selectedRoomAndRate]);

  const cancelServices = () => {
    setSelected(null);
    setScrolled(false);
  };

  const goStepBack = () => {
    setStep(step => --step);
    setSelected(null);
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
      <ExtraServicesList
        extraServices={extraServices}
        continueBooking={continueBooking}
        cancelServices={cancelServices}
        updateSelectedServices={updateSelectedServices}
        headerRef={headerRef}
      />
    );
  }
  return <Rooms onSelect={setSelected} goBack={goStepBack} />;
}

export default RoomsWithExtraServices;

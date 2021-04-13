import React from "react";
import { useSelector } from "react-redux";
import ColumnHeader from "../components/ColumnHeader";
import { getPrimaryColor } from "../redux/hotelConfig";
import ExtraService from "./ExtraService";
import Accordion, { Icon, Title } from "../components/Accordion";
import Button from "../components/Button";

function ExtraServicesList({
  extraServices,
  continueBooking,
  cancelServices,
  updateSelectedServices,
  headerRef,
}) {
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

export default ExtraServicesList;

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

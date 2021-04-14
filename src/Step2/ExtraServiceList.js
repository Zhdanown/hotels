import React from "react";
import ColumnHeader from "../components/ColumnHeader";
import ExtraService from "./ExtraService";
import Accordion, { Icon, Title } from "../components/Accordion";
import Button from "../components/Button";
import { Card } from "../components/styled";
import styled from "styled-components";

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
  if (!services) {
    return null;
  } else if (categoryName === "null") {
    return (
      <div style={{ padding: "0.75rem" }}>
        <GroupCard>
          {services.map(service => (
            <ExtraService
              key={service.id}
              {...service}
              onSelect={updateSelectedServices}
            />
          ))}
        </GroupCard>
      </div>
    );
  } else
    return (
      <Accordion
        renderTitle={(toggle, open) => (
          <Title onClick={toggle} style={{ padding: "0.75rem" }}>
            {categoryName} <Icon open={open} />
          </Title>
        )}
      >
        <div style={{ padding: "0.75rem" }}>
          <GroupCard>
            {services.map(service => (
              <ExtraService
                key={service.id}
                {...service}
                onSelect={updateSelectedServices}
              />
            ))}
          </GroupCard>
        </div>
      </Accordion>
    );
}

const GroupCard = styled(Card)`
  margin: 0;
`;

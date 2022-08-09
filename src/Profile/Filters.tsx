import { CloseOutlined, FilterOutlined } from "@ant-design/icons";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import Modal from "../components/Modal";

export const Filters = () => {
  const [isOpen, toggle] = useState(false);
  // const [origin, setOrigin] = useState({});

  const actionRef = useRef(null);



  // useEffect(() => {
  //   if (actionRef.current) {
  //     const { x, y } = actionRef.current.getBoundingClientRect();
  //     console.log(actionRef.current.getBoundingClientRect())
  //     setOrigin({ x, y });
  //   }
  // }, []);

  return (
    <>
      <button className="button" onClick={() => toggle(true)} ref={actionRef}>
        <FilterOutlined style={{ marginRight: "0.5rem" }} />
        Фильтры
      </button>

      <Modal open={isOpen} toggle={toggle}>
        <ViewContent>
          {Array.from(Array(15)).map((v,i) => (
            <div key={i} style={{ marginBottom: "2.5rem " }}>
              <label className="checkbox">
                <input type="checkbox" />
                Remember me
              </label>
            </div>
          ))}
        </ViewContent>
      </Modal>

      {/* <View open={isOpen}>
        <div className="container pr-4 pl-4">
          

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 className="title is-4 mb-0">Фильтры</h3>
            <CloseOutlined
              onClick={() => toggle(false)}
              className="p-4"
              style={{
                cursor: "pointer",
              }}
            />
          </div>

          <ViewContent>
            {Array.from(Array(15)).map(() => (
              <div style={{ marginBottom: "2.5rem " }}>
                <label className="checkbox">
                  <input type="checkbox" />
                  Remember me
                </label>
              </div>
            ))}
          </ViewContent>
        </div>
      </View> */}
    </>
  );
};

const ViewContent = styled.div``;

const View = styled.div<{ open: boolean }>`
  background: white;
  box-shadow: 0 -5px 15px 2px #aaaaaa;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  transition: transform 0.4s;
  border-radius: 8px;

  transform-origin: bottom;
  transform: scale(0) translateY(100%);
  ${p => p.open && `transform: scale(1);`}/* overflow: auto; */
`;

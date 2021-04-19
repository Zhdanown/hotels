import React from "react";
import { useSelector } from "react-redux";
import styled, { createGlobalStyle } from "styled-components";
import { getUser } from "../Auth/authReducer";
import { HTMLOverflowHidden } from "../components/styled";
import useNavbarHeight from "../Layout/hooks/useNavbarHeight";
import Navbar from "../Layout/Navbar";
import { getIsShowNavbar } from "../redux/hotelConfig";

const ProfileContainer = styled.div`
  height: calc(100vh - ${p => p.navbarHeight}px);
  overflow: auto;
`;

function Profile() {
  const isShowNavbar = useSelector(getIsShowNavbar);
  const user = useSelector(getUser);

  return (
    <>
      {isShowNavbar && <Navbar />}
      <ProfileContainer navbarHeight={useNavbarHeight}>
        <HTMLOverflowHidden />
        <h1 style={{ fontSize: "3rem" }}>Profile component</h1>
        <section>
          <h2>Добро пожаловать в личный кабинет, {user.first_name}!</h2>
          <pre>{JSON.stringify(user, null, "\t")}</pre>
          <pre>{JSON.stringify(user, null, "\t")}</pre>
        </section>
      </ProfileContainer>
    </>
  );
}

export default Profile;

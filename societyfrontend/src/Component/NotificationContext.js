import React, { createContext, useContext, useState, useEffect } from 'react';
import apiHelper from '../Common/ApiHelper';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export function NotificationProvider({ children, userInfo }) {
  const [notify, setNotify] = useState([]);
  const [societyId, setsocietyId] = useState("");

  useEffect(() => {
    async function getSociety() {
      try {
        if (userInfo?.role === "Chairman") {
          setsocietyId(userInfo?.societyData?.selectSociety);
        } else if (userInfo?.role === "Member") {
          setsocietyId(userInfo?.societyData?.societyId);
        } else {
          setsocietyId(null);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getSociety();
  }, [userInfo]);

  useEffect(() => {
    async function getNotification() {
      try {
        if (societyId) {
          const result = await apiHelper.listNotification(societyId);
          setNotify(result?.data?.data || []);
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (societyId) {
      getNotification();
    }
  }, [societyId]);

  const refreshNotifications = async () => {
    try {
      const result = await apiHelper.listNotification(societyId);
      setNotify(result?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notify, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

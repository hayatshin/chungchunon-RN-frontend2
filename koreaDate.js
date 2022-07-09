import React from "react";

export function koreaDate(ISOTime) {
  const createdTime = new Date(+ISOTime);
  const dmonth = createdTime.getMonth() + 1;
  const ampm = createdTime.getHours() >= 12 ? "오후 " : "오전 ";
  const hours = createdTime.getHours() == 12 ? 12 : createdTime.getHours() % 12;
  const completeCreatedTime =
    createdTime.getFullYear() +
    "년 " +
    dmonth +
    "월 " +
    createdTime.getDate() +
    "일 " +
    ampm +
    hours +
    "시 " +
    createdTime.getMinutes() +
    "분";
  return completeCreatedTime;
}

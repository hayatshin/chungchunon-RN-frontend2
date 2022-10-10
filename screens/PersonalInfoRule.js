import { View, Text } from "react-native";
import styled from "styled-components";

const RuleWrapper = styled.ScrollView`
  flex: 1;
  background-color: white;
  padding: 20px;
`;

const RuleHeader = styled.Text`
  font-family: "Spoqa";
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 5px;
`;

const RuleText = styled.Text`
  font-family: "Spoqa";
  font-size: 13px;
  margin-bottom: 10px;
`;

export default function PersonalInfoRule() {
  return (
    <RuleWrapper>
      <RuleHeader>가. 개인정보 수집/이용 목적</RuleHeader>
      <RuleText>
        "청춘온"은 다음의 목적을 위해 개인정보를 수집 및 이용합니다. 수집된
        개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 수집 목적이
        변경될 경우 사전에 알리고 동의를 받을 예정입니다.
      </RuleText>
      <RuleText>
        회원가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인
        식별 인증, 회원자격 유지 관리, 서비스 부정이용 방지 등을 목적으로
        개인정보를 처리합니다.
      </RuleText>
      <RuleHeader>나. 수집하는 개인정보의 항목</RuleHeader>
      <RuleText>이름, 닉네임, 생년월일, 성별, 거주지역, 핸드폰 번호</RuleText>
      <RuleHeader>다. 개인정보 보유 및 이용기간</RuleHeader>
      <RuleText>
        홈페이지 회원 정보는 회원 탈퇴시까지(2년간) 보유하며, 삭제 요청시(회원
        탈퇴시) 요청자의 개인정보를 재생이 불가능한 방법으로 즉시 파기 합니다.
      </RuleText>
      <RuleHeader>
        라. 동의를 거부할 권리가 있다는 사실과 동의 거부에 따른 불이익 내용
      </RuleHeader>
      <RuleText>
        이용자는 "청춘온"에서 수집하는 개인정보에 대해 동의를 거부할 권리가
        있으며 동의 거부 시에는 회원가입이 제한됩니다.
      </RuleText>
    </RuleWrapper>
  );
}

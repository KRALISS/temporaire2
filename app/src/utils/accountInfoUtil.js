import i18n from "../locale/i18n";
export function getStatusText(item) {
  if (item === null) {
    return { title: i18n.t("myAccount.notSpecified"), showIcon: false };
  }
  if (item.status == "CREATED")
    return { title: i18n.t("myAccount.inWaitingVerify"), showIcon: false };
  if (item.status == "TO_VALIDATE")
    return { title: i18n.t("myAccount.inProgress"), showIcon: false};
  if (item.status == "VALID")
    return { title: i18n.t("myAccount.verified"), showIcon: true };

  if (item.status == "INVALID")
    return { title: i18n.t("myAccount.invalid") +" : " +item.validation_desc , showIcon: false };
  else{
    return { title: i18n.t("myAccount.inWaitingVerify"), showIcon: false };

  }
}

export function getDocTitleText(type) {
  if (type == "PROOF_OF_REGISTRATION")
    return i18n.t("myAccount.registerOfCompany");
  if (type == "PROOF_OF_ID") return i18n.t("myAccount.proofOfID");
  if (type == "PROOF_OF_ADDRESS") return i18n.t("myAccount.proofOfAddress");
  if (type == "PROOF_OF_IBAN") return i18n.t("myAccount.proofOfIBAN");
  if (type == "PROOF_OF_HOST_ID") return i18n.t("myAccount.proofOfHostID");
  if (type == "PROOF_OF_HOST_HOSTING")
    return i18n.t("myAccount.proofOfHostHosting");
  if (type == "PROOF_OF_HOST_ADDRESS")
    return i18n.t("myAccount.proofHostAddress");
    if (type === "PROOF_OF_ID_SECONDARY") return i18n.t("myAccount.proofOfIDSecond")
  return "";
}

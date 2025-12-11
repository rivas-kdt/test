import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Section,
  Text,
} from "@react-email/components";

type ForgetPasswordEmailProps = {
  resetLink: string;
};

export const ForgetPasswordEmail = ({
  resetLink,
}: ForgetPasswordEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            marginBottom: "15px",
          }}
        >
          <div style={{ position: "absolute" }}>
            <div
              style={{
                fontSize: "1.875rem",
                fontWeight: "bold",
                letterSpacing: "-0.05em",
                color: "#FFBC2A",
                fontFamily: "Montserrat",
              }}
            >
              <span>X</span>
              <span style={{ opacity: 0.8 }}>Mon</span>
            </div>
          </div>
        </div>
        <Text style={secondary}>Reset Your Password</Text>
        <hr style={{ margin: "0 20px", opacity: "25%" }} />
        <Text
          style={{
            fontSize: "12px",
            fontWeight: "500",
            marginTop: "1rem",
            marginLeft: "25px",
          }}
        >
          {/* Good day, */}
          平素より大変お世話になっております。
        </Text>
        <Text
          style={{
            fontSize: "12px",
            fontWeight: "500",
            marginLeft: "25px",
            marginRight: "25px",
          }}
        >
          {/* We have sent you this email in response to your request to reset your
          password on XMon. */}
          XMonのパスワードリセットのご依頼を受け付けたため、本メールをお送りしております。
        </Text>
        <Text
          style={{
            fontSize: "12px",
            fontWeight: "500",
            marginLeft: "25px",
            marginRight: "25px",
          }}
        >
          {/* To reset your password, click the button below. */}
          パスワードのリセットをご希望の場合は、下記のボタンをクリックしてください。
        </Text>

        <Section style={codeContainer}>
          <Button
            href={resetLink}
            style={{
              backgroundColor: "#FFBC2A",
              borderRadius: "4px",
              color: "#fff",
              fontSize: "14px",
              fontWeight: "bold",
              padding: "12px 24px",
              textDecoration: "none",
            }}
          >
            {/* Reset Password */}
            パスワードをリセット
          </Button>
        </Section>

        <hr style={{ margin: "20px 25px 0", opacity: "25%" }} />
        <Text
          style={{
            ...paragraph,
            marginLeft: "25px",
            marginRight: "25px",
          }}
        >
          {/* Please ignore this email if you did not request a password change. */}
          パスワードの変更をお申し込みでない場合は、本メールを破棄してください。
        </Text>
      </Container>
      <Text
        style={{ fontSize: "10px", marginTop: "15px", textAlign: "center" }}
      >
        © XMon External Warehouse Monitoring System
      </Text>
    </Body>
  </Html>
);

ForgetPasswordEmail.PreviewProps = {
  resetLink: "http://localhost:3000/reset-password?token=abcdef123456",
} as ForgetPasswordEmailProps;

export default ForgetPasswordEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "5px",
  boxShadow: "0 5px 10px rgba(20,50,70,.2)",
  marginTop: "20px",
  maxWidth: "360px",
  margin: "0 auto",
  padding: "30px 0 30px",
};

const secondary = {
  color: "#0a85ea",
  fontSize: "11px",
  fontWeight: 700,
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  textTransform: "uppercase" as const,
  textAlign: "center" as const,
  margin: "16px 8px 8px 8px",
};

const codeContainer = {
  display: "flex",
  justifyContent: "center",
  margin: "16px auto 14px",
};

const paragraph = {
  color: "#444",
  fontSize: "10px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  fontStyle: "italic",
  letterSpacing: "0",
  lineHeight: "23px",
  marginLeft: "25px",
};

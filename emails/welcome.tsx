import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"
import * as React from "react"

interface WelcomeEmailProps {
  fullName: string
}

export const WelcomeEmail = ({ fullName }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Trendmall, {fullName}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#2250f4",
                offwhite: "#fafbfb",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Body className="bg-offwhite text-base font-sans">
          <Container className="bg-white p-45">
            <Heading className="text-center my-0 leading-8">
              Welcome to Trendmall, {fullName}
            </Heading>

            <Section>
              <Row>
                <Text className="text-base">
                  We are so excited to have you on board! You are now part of a
                  community that is shaping the future of shopping. We can't
                  wait to see what you discover.
                </Text>
              </Row>
            </Section>

            <Section className="text-center">
              <Button className="bg-brand text-white rounded-lg py-3 px-[18px]">
                Get Started
              </Button>
            </Section>
          </Container>

          <Container className="mt-20">
            <Section>
              <Row>
                <Column className="text-right px-20">
                  <Link>Unsubscribe</Link>
                </Column>
                <Column className="text-left">
                  <Link>Manage Preferences</Link>
                </Column>
              </Row>
            </Section>
            <Text className="text-center text-gray-400 mb-45">
              Trendmall, 1234 Elm St, New York, NY 56789
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

WelcomeEmail.PreviewProps = {
  fullName: "Bartu OZEL",
} as WelcomeEmailProps

export default WelcomeEmail

import Container from "@/components/container"
import LayoutContainer from "@/components/layoutContainer"
import SideBar from "@/components/sidebar"

export const metadata = {
    title: 'Dashboard 1',
  
  }
  
  export default function Dashboard2Layout({
    children,
  
  }: {
    children: React.ReactNode,
  }) {
    return (
      <Container>
        <LayoutContainer>
            {children}
        </LayoutContainer>   
      </Container>
    )
  }
  
import React, {useEffect} from "react";
import {Carousel, Container, Image, Card} from "react-bootstrap";
import {Link} from "gatsby";

import "./index.css";


let Index = () => {

    useEffect(() => {document.location.replace("/prenota");} );

    return(
        <Container className={"home-container"}>

             <Container className={"content"}>
                 {/*<Carousel onScroll={e => e.preventDefault()} controls={false}>
                    <Carousel.Item>
                        <Image src={"../img/slide1.jpg"} className={"carousel-image"} />
                    </Carousel.Item>
                    <Carousel.Item> <Image src={"../img/slide2.jpg"} className={"carousel-image"} /> </Carousel.Item>
                </Carousel>

                <Card>
                    <Card.Text className={"home-text"} >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dignissim tincidunt blandit. Vestibulum at efficitur sem, quis mattis sem. Donec quis nulla a ante interdum lacinia in non massa. Donec hendrerit dui et enim vehicula, eget bibendum velit hendrerit. Nunc ac purus semper, vehicula urna non, lacinia est. In hac habitasse platea dictumst. Fusce ultrices efficitur nulla pulvinar elementum. Praesent et tortor eget mi tincidunt congue. Maecenas aliquam massa eget orci commodo vehicula. Nulla pretium est sit amet purus tempus, sed fringilla enim auctor. Pellentesque dapibus ut nibh eu vestibulum. Donec a massa ac purus tristique pharetra. Proin condimentum vel sem id placerat. Donec pulvinar justo vestibulum nibh bibendum, eu fermentum urna pulvinar. Praesent a nisi auctor, mattis dui id, tincidunt lacus. Donec ac neque eget mauris finibus faucibus.
                    </Card.Text>
                </Card> */}
                <Link to={"/prenota"} className={"btn btn-primary"}>Prenota</Link>
            </Container>
        </Container>
    )
}

export default Index;
import React from "react";
import "../helpers/bootstrap.min.css";
import FormPrenotazione from "../components/FormPrenotazione";
import Layout from "../components/Layout";

export default function Home() {
    return (
        <Layout>
            <FormPrenotazione />
        </Layout>
    )
}
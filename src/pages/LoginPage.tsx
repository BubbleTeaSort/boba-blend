import { useState } from "react"
import { Link } from "react-router-dom"
import { FaSpotify } from "react-icons/fa"
import BobaDecorations from "../components/BobaDecorations"
import "./LoginPage.css"

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

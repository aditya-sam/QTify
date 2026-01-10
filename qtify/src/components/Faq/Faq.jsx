import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

export default function Faq() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get("https://qtify-backend.labs.crio.do/faq");
        if (mounted && res && res.data) {
          setFaqs(res.data.data || []);
        }
      } catch (e) {
        console.error("Failed to fetch faq", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <Typography color="white">Loading FAQs...</Typography>;
  if (!faqs.length)
    return <Typography color="white">No FAQs available.</Typography>;

  return (
    <Box padding="0 20%">
      {faqs.map((faq, idx) => (
        <Accordion
          key={idx}
          sx={{ backgroundColor: "#0c0c0c", color: "white", mb: 1 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <Typography sx={{ fontWeight: 600, fontFamily: "Poppins" }}>
              {faq.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              sx={{
                fontWeight: 600,
                fontFamily: "Poppins",
                backgroundColor: "#fff",
                borderRadius: 1,
                padding: 2,
                color: "#000",
              }}
            >
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

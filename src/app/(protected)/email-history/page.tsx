// /src/app/%28protected%29/email-history/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEmailHistory } from "@/features/email/hooks/useEmailHistory";
import { useIsMobile } from "@/hooks/useMobile";
import { Loader2, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EmailHistory() {
  // const [history, setHistory] = useState<EmailTransaction[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  const { data: history, loading, error } = useEmailHistory();

  const router = useRouter();
  const isMobile = useIsMobile();

  const [sendingEmail, setSendingEmail] = useState(false);

  const t = useTranslations("email-history");

  useEffect(() => {
    if (isMobile === undefined) return;
    if (isMobile) {
      router.push("/dashboard");
    }
  }, [isMobile, router]);

  if (loading) {
    return (
      <div className="flex justify-center p-8 items-center h-screen w-screen">
        <Skeleton className=" w-full h-1/2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">
          {t("error")}: {error}
        </p>
      </div>
    );
  }

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    const fullDate = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `${fullDate}`;
  };

  // For demo

  const handleResendEmail = async () => {
    setSendingEmail(true);
    try {
      const res = await fetch("/api/resend/email", {
        method: "POST",
      });

      if (res.status === 204) {
        toast.error(t("noDataToSend"));
      } else if (!res.ok) {
        const errorData = await res.json();
        toast.error(
          t("failedSend", { error: errorData?.error || t("unknownError") })
        );
      } else {
        toast.success(t("emailSent"));
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(t("unexpectedError"));
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
        <Button
          onClick={handleResendEmail}
          disabled={sendingEmail}
          className="py-2 px-4 flex items-center gap-2 shadow-md bg-primary"
        >
          {sendingEmail ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{t("sending")}</span>
            </>
          ) : (
            <>
              <Mail className="h-6 w-6" />
              <span>{t("sendEmail")}</span>
            </>
          )}
        </Button>
      </div>

      {loading && history.length === 0 ? (
        <p className="text-muted-foreground">{t("noHistory")}.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
          {history.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-primary flex justify-between">
                  <p>{formatFullDate(item.date)}</p>
                  <Link
                    href={`/email-history/${item.email_id}`}
                    className=" bg-primary text-primary-foreground text-base px-2 py-1 rounded-md font-normal"
                  >
                    {t("full-list")}
                  </Link>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t("email-id")}: {item.email_id}
                </p>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("lotNo")}.</TableHead>
                      <TableHead>{t("prodCode")}</TableHead>
                      <TableHead>{t("stockNo")}.</TableHead>
                      <TableHead>{t("desc")}</TableHead>
                      <TableHead>{t("stat")}</TableHead>
                      <TableHead>{t("quantity")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {item.email_transaction.slice(0, 5).map((t, index) => (
                      <TableRow key={index}>
                        <TableCell>{t.lot_no}</TableCell>
                        <TableCell>{t.product_code}</TableCell>
                        <TableCell>{t.stock_no}</TableCell>
                        <TableCell>{t.description}</TableCell>
                        <TableCell>{t.status}</TableCell>
                        <TableCell>{t.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

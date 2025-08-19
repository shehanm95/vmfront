import React, { useState, useEffect, useRef } from 'react';
import './css/frontForm.css';
import { LinkService } from '../../../frontServices/LinkService';
import { useNavigate } from 'react-router-dom';
import { FrontPageService } from '../../../frontServices/FrontPageSerivce';
import { EmailService } from '../../../services/EmailService';
import { toast } from 'react-toastify';

export interface EmailVerificationProps {
    nextUrl: string,
    givenEmail?: string,
    notFromFrontOffice?: boolean,
    closeVindow?: () => void
}

const EmailVerification = ({ nextUrl, givenEmail, notFromFrontOffice = false, closeVindow }: EmailVerificationProps) => {
    const [code, setCode] = useState(['', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(90); // 1:30 in seconds
    const [isExpired, setIsExpired] = useState(false);
    const [resending, setResending] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const frontServices = FrontPageService.getInstance();
    const linkService = LinkService.getInstance();
    const emailService = new EmailService();
    const navigate = useNavigate();

    // Set up input refs
    useEffect(() => {
        inputRefs.current = Array(4).fill(null);
    }, []);

    // Auto-redirect if visitor not found (front office)
    useEffect(() => {
        if (!notFromFrontOffice && !frontServices.getCurrectVisitor()) {
            navigate(linkService.frontOffice.visitTypes);
        }
    }, []);

    // Timer countdown
    useEffect(() => {
        if (timeLeft <= 0) {
            setIsExpired(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleInputChange = (index: number, value: string) => {
        if (!/^[0-9]$/.test(value) && value !== '') return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const getEmailToUse = (): string | null => {
        if (givenEmail && notFromFrontOffice) {
            return givenEmail;
        }
        const visitor = frontServices.getCurrectVisitor();
        return visitor ? visitor.email : null;
    };

    const handleResend = async () => {
        const emailToResend = getEmailToUse();
        if (!emailToResend) return;

        try {
            setResending(true);
            await emailService.resendOpt(emailToResend);
            setTimeLeft(90);
            setIsExpired(false);
            setCode(['', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (error) {
            // toast handled in service
        } finally {
            setResending(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const emailToUse = getEmailToUse();

        if (!emailToUse) {
            toast.error("No email found for verification.");
            return;
        }

        const enteredCode = code.join('');
        if (enteredCode.length !== 4) {
            toast.error("Please enter the complete 4-digit code.");
            return;
        }

        try {
            await emailService.checkOpt({ email: emailToUse, digits: enteredCode });

            const visitor = frontServices.getCurrectVisitor();
            if (visitor) {
                visitor.isEmailVerified = true;
                frontServices.setCurrectVisitor(visitor);
            }

            if (closeVindow) {
                closeVindow();
            }

            setTimeout(() => {
                if (!nextUrl.includes("uestion")) {
                    navigate(0);
                }
            }, 3000);

            navigate(nextUrl);
        } catch (error) {
            toast.error("Invalid or expired code.");
            setIsExpired(true);
        }
    };

    return (
        <div className="f-form-container f-form-cernter-text center column">
            <h3 className="f-form-title">
                You have {formatTime(timeLeft)} minutes to verify
            </h3>
            <h1 className="f-form-title">Email Verification</h1>
            <form className="f-form" onSubmit={handleSubmit}>
                <div className="f-form-group">
                    <label className="f-form-label">
                        Enter the verification code sent to your email
                    </label>
                    <div className="code-inputs">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                disabled={isExpired}
                                className="code-input"
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                            />
                        ))}
                    </div>
                    <p className="f-form-label">
                        {getEmailToUse()}
                    </p>
                </div>

                <div className="form-actions">
                    <button
                        className="f-form-submit"
                        type="button"
                        onClick={() => navigate(linkService.frontOffice.register)}
                    >
                        Change Email
                    </button>

                    {!isExpired ? (
                        <button
                            type="submit"
                            className="f-form-submit"
                        >
                            Submit
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="f-form-submit"
                            onClick={handleResend}
                            disabled={resending}
                        >
                            {resending ? "Resending..." : "Resend"}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default EmailVerification;

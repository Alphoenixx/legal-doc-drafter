from string import Template


def get_premium_nda_template():
    return Template(
        r"""
\documentclass[11pt]{article}

\usepackage[utf8]{inputenc}
\usepackage{geometry}
\usepackage{setspace}

\usepackage{fancyhdr}



\geometry{a4paper, margin=1in}
\setstretch{1.2}

% Header / Footer
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small Confidential}
\fancyhead[R]{\small Non-Disclosure Agreement}
\fancyfoot[C]{\thepage}

% Section formatting


\begin{document}

%------------------------------------------------
% Title Page
%------------------------------------------------

\begin{center}

{\LARGE \textbf{MUTUAL NON-DISCLOSURE AGREEMENT}}

\vspace{1cm}

{\large Confidential Legal Agreement}

\vspace{1.5cm}

This Non-Disclosure Agreement (“\textbf{Agreement}”) is entered into on

\vspace{0.5cm}

\textbf{$effective_date}

\vspace{0.5cm}

Between

\vspace{0.5cm}

\textbf{$party_a}

and

\textbf{$party_b}

\vspace{1.5cm}

For the purpose of discussing and evaluating:

\vspace{0.5cm}

\textbf{$purpose}

\end{center}

\vspace{2cm}

\noindent
This Agreement establishes the terms under which confidential
information shall be disclosed and protected.

\newpage

%------------------------------------------------
% RECITALS
%------------------------------------------------

\section*{Recitals}

WHEREAS the Parties desire to engage in discussions and exchanges
relating to the Purpose described above;

WHEREAS such discussions may require the disclosure of certain
confidential, proprietary, and commercially sensitive information;

NOW, THEREFORE, in consideration of the mutual covenants and promises
contained herein, the Parties agree as follows.

%------------------------------------------------
% DEFINITIONS
%------------------------------------------------

\section{Definition of Confidential Information}

For purposes of this Agreement, “Confidential Information” means any
non-public information disclosed by one Party (the “Disclosing Party”)
to the other Party (the “Receiving Party”) in any form whatsoever,
including but not limited to:

\begin{itemize}
\item technical data
\item business strategies
\item financial information
\item software or algorithms
\item trade secrets
\item customer information
\item product designs or prototypes
\end{itemize}

Confidential Information may be disclosed orally, visually, or in
written form and shall remain protected whether or not specifically
marked as confidential.

%------------------------------------------------
% EXCLUSIONS
%------------------------------------------------

\section{Exclusions from Confidential Information}

Confidential Information does not include information which:

\begin{enumerate}
\item is or becomes publicly available without breach of this Agreement;
\item was known to the Receiving Party prior to disclosure;
\item is independently developed without use of Confidential Information;
\item is received from a third party lawfully entitled to disclose it.
\end{enumerate}

%------------------------------------------------
% OBLIGATIONS
%------------------------------------------------

\section{Obligations of the Receiving Party}

The Receiving Party agrees to:

\begin{enumerate}
\item hold Confidential Information in strict confidence;
\item use Confidential Information solely for evaluating the Purpose;
\item restrict disclosure to employees or advisors with a legitimate need to know;
\item apply at least the same degree of care used to protect its own confidential information.
\end{enumerate}

%------------------------------------------------
% NON DISCLOSURE
%------------------------------------------------

\section{Restrictions on Disclosure}

The Receiving Party shall not disclose any Confidential Information to
any third party without the prior written consent of the Disclosing
Party, except where disclosure is required by law or court order.

%------------------------------------------------
% TERM
%------------------------------------------------

\section{Term of Agreement}

This Agreement shall remain in force for a period of
\textbf{$duration_months} months from the Effective Date.

The obligations relating to confidentiality shall survive termination
for a period of three (3) years.

%------------------------------------------------
% RETURN OF MATERIALS
%------------------------------------------------

\section{Return or Destruction of Materials}

Upon request by the Disclosing Party, the Receiving Party shall promptly:

\begin{itemize}
\item return all documents containing Confidential Information
\item destroy copies or summaries derived from such information
\item certify destruction in writing if requested
\end{itemize}

%------------------------------------------------
% GOVERNING LAW
%------------------------------------------------

\section{Governing Law}

This Agreement shall be governed by and construed in accordance with the
laws of:

\textbf{$jurisdiction}

%------------------------------------------------
% NO LICENSE
%------------------------------------------------

\section{No License Granted}

Nothing in this Agreement shall be construed as granting any rights,
licenses, or ownership in any intellectual property belonging to the
Disclosing Party.

%------------------------------------------------
% ENTIRE AGREEMENT
%------------------------------------------------

\section{Entire Agreement}

This Agreement constitutes the entire understanding between the Parties
with respect to the subject matter hereof and supersedes all prior
agreements or understandings.

%------------------------------------------------
% SIGNATURES
%------------------------------------------------

\vspace{1.5cm}

\noindent
\textbf{IN WITNESS WHEREOF}, the Parties have executed this Agreement as
of the Effective Date written above.

\vspace{1cm}

\begin{tabular}{p{7cm} p{7cm}}

\textbf{$party_a} & \textbf{$party_b} \\

\vspace{0.5cm} & \vspace{0.5cm} \\

\hrulefill & \hrulefill \\

Authorized Signature & Authorized Signature \\

Name: & Name: \\

Title: & Title: \\

Date: & Date: \\

\end{tabular}

\end{document}
"""
    )


def get_premium_mou_template():
    return Template(
        r"""
\documentclass[11pt]{article}

\usepackage[utf8]{inputenc}
\usepackage{geometry}
\usepackage{setspace}

\usepackage{fancyhdr}



\geometry{a4paper, margin=1in}
\setstretch{1.2}

\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small Memorandum of Understanding}
\fancyhead[R]{\small $effective_date}
\fancyfoot[C]{\thepage}



\begin{document}

%------------------------------------------------
% Title Page
%------------------------------------------------

\begin{center}

{\LARGE \textbf{MEMORANDUM OF UNDERSTANDING}}

\vspace{1cm}

{\large Strategic Cooperation Agreement}

\vspace{1.5cm}

This Memorandum of Understanding ("MOU") is entered into on

\vspace{0.4cm}

\textbf{$effective_date}

\vspace{0.5cm}

Between

\vspace{0.5cm}

\textbf{$party_a}

and

\textbf{$party_b}

\vspace{1.5cm}

Regarding the following initiative:

\vspace{0.5cm}

\textbf{$purpose}

\end{center}

\vspace{2cm}

\noindent
This Memorandum of Understanding establishes a framework for cooperation
between the Parties and outlines the principles governing their
anticipated collaboration.

\newpage

%------------------------------------------------
% RECITALS
%------------------------------------------------

\section*{Recitals}

WHEREAS the Parties share a mutual interest in exploring opportunities
for collaboration relating to the Purpose described above;

WHEREAS both Parties desire to define the preliminary understanding
between them concerning their respective roles, responsibilities,
and intentions;

NOW, THEREFORE, the Parties agree to the following terms.

%------------------------------------------------
% PURPOSE
%------------------------------------------------

\section{Purpose of the Memorandum}

The purpose of this Memorandum is to establish a general framework for
cooperation between the Parties in relation to:

\textbf{$purpose}

This document is intended to outline the mutual expectations of the
Parties and serve as the basis for further discussions and negotiations.

%------------------------------------------------
% RESPONSIBILITIES
%------------------------------------------------

\section{Roles and Responsibilities}

Each Party agrees to contribute toward the achievement of the Purpose
in accordance with the following anticipated responsibilities:

\textbf{$responsibilities}

The Parties acknowledge that the above responsibilities may evolve
during the course of collaboration and may be further detailed in
future definitive agreements.

%------------------------------------------------
% COOPERATION
%------------------------------------------------

\section{Principles of Cooperation}

The Parties agree that their cooperation shall be guided by the
following principles:

\begin{itemize}
\item mutual respect and transparency
\item good faith negotiation
\item timely communication of relevant developments
\item reasonable allocation of responsibilities
\item compliance with applicable laws and regulations
\end{itemize}

%------------------------------------------------
% CONFIDENTIALITY
%------------------------------------------------

\section{Confidentiality}

The Parties agree that any confidential information exchanged in
connection with this Memorandum shall be treated with appropriate
confidentiality and shall not be disclosed to any third party without
prior written consent of the disclosing Party.

This confidentiality obligation shall survive the termination or
expiration of this Memorandum.

%------------------------------------------------
% FINANCIAL ARRANGEMENTS
%------------------------------------------------

\section{Financial Arrangements}

Unless otherwise expressly agreed in writing, each Party shall bear its
own costs and expenses incurred in connection with the negotiation,
implementation, and performance of this Memorandum.

Any future financial arrangements shall be set forth in a separate
written agreement duly executed by the Parties.

%------------------------------------------------
% TERM
%------------------------------------------------

\section{Term of the Memorandum}

This Memorandum shall remain effective for a period of

\textbf{$duration_months} months

from the Effective Date unless extended or terminated earlier by
mutual written consent of the Parties.

%------------------------------------------------
% NON BINDING CLAUSE
%------------------------------------------------

\section{Non-Binding Nature}

Except for the provisions relating to confidentiality and governing
law, this Memorandum of Understanding is intended solely as an
expression of the current intentions of the Parties and does not
create legally binding obligations.

Any binding commitments between the Parties shall be set forth in a
separate definitive agreement executed by both Parties.

%------------------------------------------------
% GOVERNING LAW
%------------------------------------------------

\section{Governing Law}

This Memorandum shall be governed by and interpreted in accordance
with the laws of:

\textbf{$jurisdiction}

%------------------------------------------------
% ENTIRE UNDERSTANDING
%------------------------------------------------

\section{Entire Understanding}

This Memorandum represents the entire understanding between the
Parties concerning the subject matter herein and supersedes all prior
discussions or communications relating thereto.

%------------------------------------------------
% SIGNATURES
%------------------------------------------------

\vspace{1.5cm}

\noindent
\textbf{IN WITNESS WHEREOF}, the Parties have executed this Memorandum
of Understanding as of the Effective Date stated above.

\vspace{1cm}

\begin{tabular}{p{7cm} p{7cm}}

\textbf{$party_a} & \textbf{$party_b} \\

\vspace{0.5cm} & \vspace{0.5cm} \\

\hrulefill & \hrulefill \\

Authorized Signature & Authorized Signature \\

Name: & Name: \\

Title: & Title: \\

Date: & Date: \\

\end{tabular}

\end{document}
"""
    )


def get_premium_service_agreement_template():
    return Template(
        r"""
\documentclass[11pt]{article}

\usepackage[utf8]{inputenc}
\usepackage{geometry}
\usepackage{setspace}

\usepackage{fancyhdr}



\geometry{a4paper, margin=1in}
\setstretch{1.2}

\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small Master Service Agreement}
\fancyhead[R]{\small $effective_date}
\fancyfoot[C]{\thepage}



\begin{document}

%------------------------------------------------
% TITLE
%------------------------------------------------

\begin{center}

{\LARGE \textbf{MASTER SERVICE AGREEMENT}}

\vspace{1cm}

{\large Professional Services Contract}

\vspace{1.5cm}

This Master Service Agreement ("Agreement") is entered into on

\vspace{0.4cm}

\textbf{$effective_date}

\vspace{0.5cm}

Between

\vspace{0.5cm}

\textbf{$provider}
("Service Provider")

and

\textbf{$client}
("Client")

\end{center}

\vspace{2cm}

\noindent
This Agreement establishes the terms and conditions under which the
Service Provider will perform services for the Client.

\newpage

%------------------------------------------------
% RECITALS
%------------------------------------------------

\section*{Recitals}

WHEREAS the Client desires to obtain certain professional services;

WHEREAS the Service Provider possesses the expertise, personnel, and
resources necessary to perform such services;

NOW, THEREFORE, in consideration of the mutual covenants contained
herein, the Parties agree as follows.

%------------------------------------------------
% SERVICES
%------------------------------------------------

\section{Scope of Services}

The Service Provider agrees to provide the following services to the Client:

\textbf{$services_desc}

The Services shall be performed in a professional manner consistent
with generally accepted industry standards.

%------------------------------------------------
% PERFORMANCE STANDARD
%------------------------------------------------

\section{Standard of Performance}

The Service Provider shall:

\begin{itemize}
\item perform all Services with reasonable care and skill
\item comply with applicable laws and regulations
\item provide qualified personnel necessary for completion of Services
\item maintain adequate resources to fulfill contractual obligations
\end{itemize}

%------------------------------------------------
% COMPENSATION
%------------------------------------------------

\section{Compensation and Payment Terms}

In consideration for the Services provided, the Client agrees to pay
the Service Provider according to the following terms:

\textbf{$payment_terms}

Unless otherwise agreed in writing, invoices shall be payable within
thirty (30) days of receipt.

Late payments may incur interest charges in accordance with applicable
law.

%------------------------------------------------
% TERM
%------------------------------------------------

\section{Term of Agreement}

This Agreement shall commence on the Effective Date and remain in
effect for a period of:

\textbf{$duration_months} months

unless earlier terminated in accordance with the provisions of this
Agreement.

%------------------------------------------------
% CONFIDENTIALITY
%------------------------------------------------

\section{Confidentiality}

Each Party acknowledges that during the course of this Agreement it may
receive confidential or proprietary information belonging to the other
Party.

Both Parties agree to:

\begin{itemize}
\item maintain strict confidentiality of such information
\item use the information solely for purposes related to this Agreement
\item prevent disclosure to unauthorized third parties
\end{itemize}

These confidentiality obligations shall survive termination of this
Agreement.

%------------------------------------------------
% INTELLECTUAL PROPERTY
%------------------------------------------------

\section{Intellectual Property}

Unless otherwise agreed in writing:

\begin{itemize}
\item all intellectual property owned prior to this Agreement shall remain the property of its original owner
\item deliverables specifically created for the Client may become the property of the Client upon full payment
\item the Service Provider retains ownership of any pre-existing tools,
methods, or proprietary technologies
\end{itemize}

%------------------------------------------------
% LIMITATION OF LIABILITY
%------------------------------------------------

\section{Limitation of Liability}

To the maximum extent permitted by law, neither Party shall be liable
for any indirect, incidental, or consequential damages arising from
this Agreement.

The total liability of the Service Provider shall not exceed the total
amount paid by the Client under this Agreement.

%------------------------------------------------
% TERMINATION
%------------------------------------------------

\section{Termination}

Either Party may terminate this Agreement:

\begin{enumerate}
\item upon written notice if the other Party materially breaches this Agreement and fails to cure such breach within fifteen (15) days;
\item immediately if the other Party becomes insolvent or ceases operations;
\item by mutual written consent of both Parties.
\end{enumerate}

Upon termination, the Client shall compensate the Service Provider for
all Services performed up to the date of termination.

%------------------------------------------------
% INDEPENDENT CONTRACTOR
%------------------------------------------------

\section{Independent Contractor Relationship}

The Service Provider shall perform all Services as an independent
contractor. Nothing in this Agreement shall be construed to create a
partnership, joint venture, or employer-employee relationship between
the Parties.

%------------------------------------------------
% GOVERNING LAW
%------------------------------------------------

\section{Governing Law}

This Agreement shall be governed by and construed in accordance with
the laws of:

\textbf{$jurisdiction}

%------------------------------------------------
% ENTIRE AGREEMENT
%------------------------------------------------

\section{Entire Agreement}

This Agreement constitutes the entire understanding between the Parties
and supersedes all prior agreements, negotiations, or representations
relating to the subject matter herein.

%------------------------------------------------
% SIGNATURES
%------------------------------------------------

\vspace{1.5cm}

\noindent
\textbf{IN WITNESS WHEREOF}, the Parties have executed this Master
Service Agreement as of the Effective Date written above.

\vspace{1cm}

\begin{tabular}{p{7cm} p{7cm}}

\textbf{Service Provider: $provider} &
\textbf{Client: $client} \\

\vspace{0.5cm} & \vspace{0.5cm} \\

\hrulefill & \hrulefill \\

Authorized Signature & Authorized Signature \\

Name: & Name: \\

Title: & Title: \\

Date: & Date: \\

\end{tabular}

\end{document}
"""
    )


def get_premium_partnership_agreement_template():
    return Template(
        r"""
\documentclass[11pt]{article}

\usepackage[utf8]{inputenc}
\usepackage{geometry}
\usepackage{setspace}

\usepackage{fancyhdr}



\geometry{a4paper, margin=1in}
\setstretch{1.2}

\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small Partnership Agreement}
\fancyhead[R]{\small $business_name}
\fancyfoot[C]{\thepage}



\begin{document}

%------------------------------------------------
% TITLE
%------------------------------------------------

\begin{center}

{\LARGE \textbf{GENERAL PARTNERSHIP AGREEMENT}}

\vspace{1cm}

{\large Formation and Governance of Partnership}

\vspace{1.5cm}

This Partnership Agreement ("Agreement") is entered into on

\vspace{0.4cm}

\textbf{$effective_date}

\vspace{0.5cm}

Between

\vspace{0.5cm}

\textbf{$partner_a}

and

\textbf{$partner_b}

\vspace{1.5cm}

to establish a business partnership under the name

\vspace{0.5cm}

\textbf{$business_name}

\end{center}

\vspace{2cm}

\noindent
The Parties hereby agree to associate themselves as partners for the
purpose of carrying on the business described in this Agreement.

\newpage

%------------------------------------------------
% RECITALS
%------------------------------------------------

\section*{Recitals}

WHEREAS the Partners desire to combine their resources, expertise,
and efforts to conduct a business venture;

WHEREAS the Partners wish to define their respective rights,
responsibilities, and obligations;

NOW, THEREFORE, the Partners agree as follows.

%------------------------------------------------
% PURPOSE
%------------------------------------------------

\section{Purpose of the Partnership}

The primary purpose of the Partnership shall be:

\textbf{$purpose}

The Partnership may engage in any lawful business activities
necessary to achieve the stated purpose.

%------------------------------------------------
% BUSINESS NAME AND LOCATION
%------------------------------------------------

\section{Business Name and Principal Office}

The Partnership shall operate under the name:

\textbf{$business_name}

The principal place of business shall be determined by mutual
agreement of the Partners and may be changed from time to time
upon unanimous consent.

%------------------------------------------------
% CAPITAL CONTRIBUTIONS
%------------------------------------------------

\section{Capital Contributions}

Each Partner agrees to contribute capital, resources,
services, or other assets necessary for the operation of the
Partnership.

The initial ownership interests of the Partners shall be
allocated as follows:

\textbf{$equity_split}

Additional capital contributions may be required upon
mutual agreement of the Partners.

%------------------------------------------------
% PROFITS AND LOSSES
%------------------------------------------------

\section{Allocation of Profits and Losses}

The net profits and losses of the Partnership shall be
allocated among the Partners in proportion to their respective
ownership interests unless otherwise agreed in writing.

Distributions shall be made at intervals mutually agreed
upon by the Partners.

%------------------------------------------------
% MANAGEMENT
%------------------------------------------------

\section{Management of the Partnership}

The Partners shall jointly participate in the management
and operation of the Partnership.

Unless otherwise agreed:

\begin{itemize}
\item major decisions shall require unanimous consent
\item each Partner shall have equal authority to act on behalf of the Partnership
\item no Partner shall bind the Partnership to significant financial obligations without prior approval
\end{itemize}

%------------------------------------------------
% DUTIES OF PARTNERS
%------------------------------------------------

\section{Duties and Responsibilities}

Each Partner agrees to:

\begin{itemize}
\item act in good faith and in the best interests of the Partnership
\item devote reasonable time and effort to Partnership activities
\item avoid conflicts of interest
\item maintain accurate records of business transactions
\end{itemize}

%------------------------------------------------
% ACCOUNTING AND RECORDS
%------------------------------------------------

\section{Accounting and Records}

Accurate books and records of the Partnership shall be
maintained and made available for inspection by any Partner
upon reasonable notice.

Financial statements shall be prepared periodically to
reflect the financial position of the Partnership.

%------------------------------------------------
% TERM
%------------------------------------------------

\section{Term of Partnership}

This Partnership shall commence on the Effective Date and
shall continue until dissolved in accordance with the terms
of this Agreement.

%------------------------------------------------
% WITHDRAWAL OF PARTNER
%------------------------------------------------

\section{Withdrawal of a Partner}

A Partner may withdraw from the Partnership upon providing
reasonable written notice to the other Partner.

The remaining Partner may elect to continue the business or
liquidate the Partnership assets.

%------------------------------------------------
% DISSOLUTION
%------------------------------------------------

\section{Dissolution of the Partnership}

The Partnership may be dissolved upon:

\begin{enumerate}
\item mutual written agreement of the Partners
\item the withdrawal, death, or incapacity of a Partner
\item circumstances making continuation of the business impractical
\end{enumerate}

Upon dissolution, Partnership assets shall be distributed
after payment of liabilities in accordance with ownership interests.

%------------------------------------------------
% DISPUTE RESOLUTION
%------------------------------------------------

\section{Dispute Resolution}

Any disputes arising under this Agreement shall first be
resolved through good faith negotiation between the Partners.

If such negotiations fail, the dispute may be submitted to
mediation or arbitration before pursuing litigation.

%------------------------------------------------
% GOVERNING LAW
%------------------------------------------------

\section{Governing Law}

This Agreement shall be governed by the laws of:

\textbf{$jurisdiction}

%------------------------------------------------
% ENTIRE AGREEMENT
%------------------------------------------------

\section{Entire Agreement}

This Agreement constitutes the entire agreement between
the Partners and supersedes all prior negotiations,
understandings, or agreements.

%------------------------------------------------
% SIGNATURES
%------------------------------------------------

\vspace{1.5cm}

\noindent
\textbf{IN WITNESS WHEREOF}, the Partners have executed
this Partnership Agreement as of the Effective Date.

\vspace{1cm}

\begin{tabular}{p{7cm} p{7cm}}

\textbf{$partner_a} &
\textbf{$partner_b} \\

\vspace{0.5cm} & \vspace{0.5cm} \\

\hrulefill & \hrulefill \\

Signature & Signature \\

Date: & Date: \\

\end{tabular}

\end{document}
"""
    )


def get_premium_collaboration_agreement_template():
    return Template(
        r"""
\documentclass[11pt]{article}

\usepackage[utf8]{inputenc}
\usepackage{geometry}
\usepackage{setspace}

\usepackage{fancyhdr}



\geometry{a4paper, margin=1in}
\setstretch{1.2}

\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small Collaboration Agreement}
\fancyhead[R]{\small $project_name}
\fancyfoot[C]{\thepage}



\begin{document}

%------------------------------------------------
% TITLE
%------------------------------------------------

\begin{center}

{\LARGE \textbf{COLLABORATION AGREEMENT}}

\vspace{1cm}

{\large Joint Project Cooperation}

\vspace{1.5cm}

This Collaboration Agreement ("Agreement") is entered into on

\vspace{0.4cm}

\textbf{$effective_date}

\vspace{0.5cm}

Between

\vspace{0.5cm}

\textbf{$party_a}

and

\textbf{$party_b}

\vspace{1.5cm}

for the purpose of collaborating on the following project:

\vspace{0.5cm}

\textbf{$project_name}

\end{center}

\vspace{2cm}

\noindent
The Parties agree to cooperate in good faith and combine their resources,
expertise, and capabilities in order to pursue the objectives described
in this Agreement.

\newpage

%------------------------------------------------
% RECITALS
%------------------------------------------------

\section*{Recitals}

WHEREAS the Parties desire to collaborate in relation to the Project;

WHEREAS each Party possesses knowledge, expertise, and resources that
may contribute to the success of the Project;

NOW, THEREFORE, in consideration of the mutual covenants and promises
contained herein, the Parties agree as follows.

%------------------------------------------------
% PURPOSE
%------------------------------------------------

\section{Purpose of Collaboration}

The purpose of this Agreement is to define the framework under which
the Parties shall cooperate in relation to the Project known as:

\textbf{$project_name}

The Parties intend to collaborate in good faith to achieve the
objectives associated with the Project.

%------------------------------------------------
% CONTRIBUTIONS
%------------------------------------------------

\section{Contributions of the Parties}

Each Party agrees to contribute resources, expertise, personnel,
or other support necessary for the successful execution of the Project.

The anticipated contributions of the Parties are described as follows:

\textbf{$contributions}

These contributions may be further refined or expanded through mutual
agreement during the course of the collaboration.

%------------------------------------------------
% GOVERNANCE
%------------------------------------------------

\section{Project Governance}

The Parties agree to coordinate activities relating to the Project
through regular communication and joint decision-making.

Unless otherwise agreed:

\begin{itemize}
\item major decisions regarding the Project shall require mutual consent
\item each Party shall designate a representative responsible for coordination
\item progress updates shall be exchanged periodically
\end{itemize}

%------------------------------------------------
% INTELLECTUAL PROPERTY
%------------------------------------------------

\section{Intellectual Property Rights}

Ownership of intellectual property associated with the Project
shall be determined as follows:

\textbf{$ip_ownership}

Unless otherwise agreed:

\begin{itemize}
\item each Party retains ownership of intellectual property created prior to this Agreement
\item jointly developed intellectual property may be shared according to mutually agreed terms
\end{itemize}

%------------------------------------------------
% CONFIDENTIALITY
%------------------------------------------------

\section{Confidentiality}

Each Party acknowledges that confidential information may be exchanged
during the course of the collaboration.

Both Parties agree to:

\begin{itemize}
\item protect such confidential information from unauthorized disclosure
\item use such information solely for purposes related to the Project
\item restrict access to personnel who require such information
\end{itemize}

These confidentiality obligations shall survive termination of this
Agreement.

%------------------------------------------------
% TERM
%------------------------------------------------

\section{Term of Collaboration}

This Agreement shall remain in effect for a period of

\textbf{$duration_months} months

from the Effective Date unless extended or terminated earlier by
mutual written agreement.

%------------------------------------------------
% TERMINATION
%------------------------------------------------

\section{Termination}

This Agreement may be terminated under any of the following circumstances:

\begin{enumerate}
\item mutual written agreement of the Parties
\item material breach of this Agreement by either Party
\item circumstances that make continuation of the Project impractical
\end{enumerate}

Upon termination, the Parties shall cooperate in good faith to
conclude outstanding activities and address any intellectual
property or confidential information concerns.

%------------------------------------------------
% DISPUTE RESOLUTION
%------------------------------------------------

\section{Dispute Resolution}

Any disputes arising from this Agreement shall first be addressed
through good faith negotiations between the Parties.

If the dispute cannot be resolved through negotiation, the Parties
may pursue mediation, arbitration, or other legal remedies as
permitted by applicable law.

%------------------------------------------------
% GOVERNING LAW
%------------------------------------------------

\section{Governing Law}

This Agreement shall be governed by and interpreted in accordance
with the laws of:

\textbf{$jurisdiction}

%------------------------------------------------
% ENTIRE AGREEMENT
%------------------------------------------------

\section{Entire Agreement}

This Agreement represents the complete understanding between the
Parties regarding the collaboration described herein and supersedes
all prior discussions, negotiations, or agreements.

%------------------------------------------------
% SIGNATURES
%------------------------------------------------

\vspace{1.5cm}

\noindent
\textbf{IN WITNESS WHEREOF}, the Parties have executed this
Collaboration Agreement as of the Effective Date written above.

\vspace{1cm}

\begin{tabular}{p{7cm} p{7cm}}

\textbf{$party_a} &
\textbf{$party_b} \\

\vspace{0.5cm} & \vspace{0.5cm} \\

\hrulefill & \hrulefill \\

Authorized Signature & Authorized Signature \\

Name: & Name: \\

Title: & Title: \\

Date: & Date: \\

\end{tabular}

\end{document}
"""
    )


def get_premium_contract_template():
    return Template(
        r"""
\documentclass[11pt]{article}

\usepackage[utf8]{inputenc}
\usepackage{geometry}
\usepackage{setspace}

\usepackage{fancyhdr}



\geometry{a4paper, margin=1in}
\setstretch{1.2}

\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small Legal Contract}
\fancyhead[R]{\small $effective_date}
\fancyfoot[C]{\thepage}



\begin{document}

%------------------------------------------------
% TITLE
%------------------------------------------------

\begin{center}

{\LARGE \textbf{GENERAL CONTRACTUAL AGREEMENT}}

\vspace{1cm}

{\large Binding Legal Contract}

\vspace{1.5cm}

This Contract ("Agreement") is entered into on

\vspace{0.4cm}

\textbf{$effective_date}

\vspace{0.5cm}

Between

\vspace{0.5cm}

\textbf{$party_a}

and

\textbf{$party_b}

\end{center}

\vspace{2cm}

\noindent
The Parties agree to enter into this legally binding Agreement
under the terms and conditions set forth below.

\newpage

%------------------------------------------------
% RECITALS
%------------------------------------------------

\section*{Recitals}

WHEREAS the Parties desire to establish a legally binding
relationship governing certain obligations and exchanges;

WHEREAS both Parties acknowledge that they have the authority
and capacity to enter into this Agreement;

NOW, THEREFORE, in consideration of the mutual promises and
agreements contained herein, the Parties agree as follows.

%------------------------------------------------
% OBLIGATIONS
%------------------------------------------------

\section{Obligations of the Parties}

The Parties agree to perform the following obligations:

\textbf{$obligations}

Each Party agrees to act in good faith and to perform their
respective obligations in a timely and professional manner.

%------------------------------------------------
% CONSIDERATION
%------------------------------------------------

\section{Consideration}

In exchange for the obligations undertaken under this Agreement,
the following consideration shall be provided:

\textbf{$consideration}

The Parties acknowledge that the above consideration represents
fair and adequate value for the commitments described herein.

%------------------------------------------------
% REPRESENTATIONS
%------------------------------------------------

\section{Representations and Warranties}

Each Party represents and warrants that:

\begin{itemize}

\item it has full legal authority to enter into this Agreement
\item execution of this Agreement does not violate any other agreements
\item it will comply with all applicable laws and regulations

\end{itemize}

%------------------------------------------------
% CONFIDENTIALITY
%------------------------------------------------

\section{Confidentiality}

If confidential information is exchanged during the performance
of this Agreement, both Parties agree to protect such information
and not disclose it to third parties without prior written consent.

These confidentiality obligations shall survive the termination
of this Agreement.

%------------------------------------------------
% LIMITATION OF LIABILITY
%------------------------------------------------

\section{Limitation of Liability}

To the extent permitted by applicable law, neither Party shall
be liable for indirect, incidental, or consequential damages
arising from this Agreement.

Liability shall be limited to the extent reasonably foreseeable
in connection with the performance of this Agreement.

%------------------------------------------------
% BREACH
%------------------------------------------------

\section{Breach and Remedies}

If either Party fails to perform its obligations under this
Agreement, the non-breaching Party may provide written notice
describing the breach.

If the breach is not remedied within a reasonable time, the
non-breaching Party may pursue appropriate legal remedies.

%------------------------------------------------
% TERMINATION
%------------------------------------------------

\section{Termination}

This Agreement may be terminated:

\begin{enumerate}

\item by mutual written consent of the Parties
\item if either Party materially breaches this Agreement
\item if circumstances make performance of the Agreement impossible

\end{enumerate}

Upon termination, any outstanding obligations shall be settled
in accordance with the provisions of this Agreement.

%------------------------------------------------
% GOVERNING LAW
%------------------------------------------------

\section{Governing Law}

This Agreement shall be governed by the laws of:

\textbf{$jurisdiction}

%------------------------------------------------
% ENTIRE AGREEMENT
%------------------------------------------------

\section{Entire Agreement}

This Agreement represents the complete and entire agreement
between the Parties concerning the subject matter herein and
supersedes any prior discussions, negotiations, or agreements.

%------------------------------------------------
% SIGNATURES
%------------------------------------------------

\vspace{1.5cm}

\noindent
\textbf{IN WITNESS WHEREOF}, the Parties have executed this
Agreement as of the Effective Date written above.

\vspace{1cm}

\begin{tabular}{p{7cm} p{7cm}}

\textbf{$party_a} &
\textbf{$party_b} \\

\vspace{0.5cm} & \vspace{0.5cm} \\

\hrulefill & \hrulefill \\

Authorized Signature & Authorized Signature \\

Name: & Name: \\

Title: & Title: \\

Date: & Date: \\

\end{tabular}

\end{document}
"""
    )


def get_premium_statement_of_agreement_template():
    return Template(
        r"""
\documentclass[11pt]{article}

\usepackage[utf8]{inputenc}
\usepackage{geometry}
\usepackage{setspace}

\usepackage{fancyhdr}


\geometry{a4paper, margin=1in}
\setstretch{1.2}

\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small Statement of Agreement}
\fancyhead[R]{\small $effective_date}
\fancyfoot[C]{\thepage}



\begin{document}

%------------------------------------------------
% TITLE
%------------------------------------------------

\begin{center}

{\LARGE \textbf{STATEMENT OF AGREEMENT}}

\vspace{1cm}

{\large Formal Record of Mutual Understanding}

\vspace{1.5cm}

This Statement of Agreement ("Statement") is made on

\vspace{0.4cm}

\textbf{$effective_date}

\vspace{0.5cm}

Between

\vspace{0.5cm}

\textbf{$party_a}

and

\textbf{$party_b}

\end{center}

\vspace{2cm}

\noindent
The Parties hereby acknowledge that they have discussed and mutually
agreed upon the matters set forth in this Statement. This document
serves as a written record of their understanding and commitments.

\newpage

%------------------------------------------------
% PURPOSE
%------------------------------------------------

\section*{Acknowledgment of Agreement}

On the date indicated above, the Parties confirm that they have
reached a mutual understanding regarding the following matters.

\section{Agreed Terms}

The Parties acknowledge and agree to the following terms and
conditions:

\textbf{$agreed_terms}

The Parties affirm that the above terms accurately reflect their
intentions and mutual understanding at the time this Statement
is executed.

%------------------------------------------------
% GOOD FAITH
%------------------------------------------------

\section{Good Faith Commitment}

The Parties agree to act in good faith in implementing the
terms described in this Statement and to cooperate reasonably
in fulfilling the intentions expressed herein.

%------------------------------------------------
% RECORD OF UNDERSTANDING
%------------------------------------------------

\section{Record of Understanding}

This Statement serves as a formal written record of the
agreement reached between the Parties and may be referenced
in future discussions, negotiations, or agreements relating
to the same subject matter.

%------------------------------------------------
% ENTIRE UNDERSTANDING
%------------------------------------------------

\section{Entire Understanding}

This Statement represents the entire understanding between
the Parties concerning the subject matter described herein
and supersedes any prior verbal discussions relating to the
same matters.

%------------------------------------------------
% SIGNATURES
%------------------------------------------------

\vspace{1.5cm}

\noindent
\textbf{IN WITNESS WHEREOF}, the Parties acknowledge their
agreement to the terms described above.

\vspace{1cm}

\begin{tabular}{p{7cm} p{7cm}}

\textbf{$party_a} &
\textbf{$party_b} \\

\vspace{0.5cm} & \vspace{0.5cm} \\

\hrulefill & \hrulefill \\

Signature & Signature \\

Name: & Name: \\

Title: & Title: \\

Date: & Date: \\

\end{tabular}

\end{document}
"""
    )


def get_premium_meeting_resolution_template():
    return Template(
        r"""
\documentclass[11pt]{article}

\usepackage[utf8]{inputenc}
\usepackage{geometry}
\usepackage{setspace}

\usepackage{fancyhdr}


\geometry{a4paper, margin=1in}
\setstretch{1.2}

\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small Corporate Resolution}
\fancyhead[R]{\small $company_name}
\fancyfoot[C]{\thepage}



\begin{document}

%------------------------------------------------
% TITLE
%------------------------------------------------

\begin{center}

{\LARGE \textbf{MINUTES AND CORPORATE RESOLUTION}}

\vspace{1cm}

{\large Formal Record of Meeting and Adopted Resolutions}

\vspace{1.5cm}

Company:

\textbf{$company_name}

\vspace{0.5cm}

Meeting Date:

\textbf{$meeting_date}

\end{center}

\vspace{2cm}

\noindent
A meeting of the authorized representatives, directors, or members of
\textbf{$company_name} was duly convened on the date specified above
for the purpose of discussing and approving matters relating to the
business operations of the organization.

\newpage

%------------------------------------------------
% ATTENDEES
%------------------------------------------------

\section{Attendees}

The following individuals were present at the meeting:

\textbf{$attendees}

The attendees confirmed that a quorum was present and that the
meeting was properly constituted in accordance with applicable
organizational rules or governing documents.

%------------------------------------------------
% BUSINESS DISCUSSED
%------------------------------------------------

\section{Business Discussed}

During the meeting, the attendees discussed matters relating to
the strategic direction, operational activities, or administrative
decisions of the organization.

Following these discussions, certain actions were proposed and
considered for formal adoption by the meeting participants.

%------------------------------------------------
% RESOLUTIONS
%------------------------------------------------

\section{Resolutions Adopted}

After due consideration and discussion, the following resolutions
were proposed and unanimously adopted by the attendees:

\textbf{$resolutions}

The attendees agreed that the above resolutions reflect the
decisions made during the meeting and authorize appropriate
actions necessary for their implementation.

%------------------------------------------------
% AUTHORIZATION
%------------------------------------------------

\section{Authorization of Officers}

The officers or authorized representatives of the organization
are hereby empowered to take all necessary steps and execute
any documents required to carry out the intent of the resolutions
adopted at this meeting.

%------------------------------------------------
% CERTIFICATION
%------------------------------------------------

\section*{Certification}

The undersigned certify that the foregoing is a true and accurate
record of the proceedings of the meeting held on the date stated
above and that the resolutions described herein were duly adopted.

%------------------------------------------------
% SIGNATURES
%------------------------------------------------

\vspace{1.5cm}

\begin{tabular}{p{7cm} p{7cm}}

\textbf{Chairperson / Meeting Leader} &
\textbf{Secretary / Recording Officer} \\

\vspace{0.5cm} & \vspace{0.5cm} \\

\hrulefill & \hrulefill \\

Name: & Name: \\

Date: & Date: \\

\end{tabular}

\end{document}
"""
    )

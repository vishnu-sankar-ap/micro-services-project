# AWS EKS Microservices Deployment with Terraform, Helm & GitHub Actions

## 📌 Project Overview

This project demonstrates the deployment of a containerized microservices application on **Amazon EKS (Elastic Kubernetes Service)** using Infrastructure as Code, Kubernetes, Helm, and CI/CD automation.

The application consists of multiple Node.js microservices that are containerized with Docker, stored in Amazon ECR, deployed to an Amazon EKS cluster using Helm, and exposed externally through an AWS Application Load Balancer.

Infrastructure provisioning and Kubernetes deployment are automated using **Terraform and GitHub Actions**.

---

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │       Developer      │
                         │      Git Push        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    GitHub Actions    │
                         │       CI/CD          │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
          ┌─────────────────┐             ┌─────────────────┐
          │   Docker Build  │             │    Terraform    │
          └────────┬────────┘             │ Infrastructure  │
                   │                      └────────┬────────┘
                   ▼                               │
          ┌─────────────────┐                      ▼
          │   Amazon ECR    │             ┌─────────────────┐
          │ Docker Images   │             │    Amazon EKS   │
          └────────┬────────┘             │     Cluster     │
                   │                      └────────┬────────┘
                   │                               │
                   └──────────────┬────────────────┘
                                  ▼
                       ┌─────────────────────┐
                       │       Helm          │
                       │ Kubernetes Deploy   │
                       └──────────┬──────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
       ┌────────────┐      ┌────────────┐      ┌────────────┐
       │   User     │      │  Product   │      │   Order    │
       │  Service   │      │  Service   │      │  Service   │
       └────────────┘      └────────────┘      └────────────┘
              │                   │                   │
              └───────────────────┼───────────────────┘
                                  ▼
                       ┌─────────────────────┐
                       │ AWS ALB Ingress     │
                       │ External Access     │
                       └─────────────────────┘
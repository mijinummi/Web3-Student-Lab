//! Web3 Student Lab Soroban contract playground modules.
//!
//! The MVP contract crate exposes focused educational contracts that compile
//! cleanly with the Soroban SDK and can be exercised from unit tests or the
//! classroom playground. The modules below are intentionally small, documented,
//! and self-contained so learners can study one smart-contract pattern at a
//! time without unrelated examples interfering with the build.

#![no_std]
#![allow(clippy::needless_pass_by_value)]

pub mod file_notarization;
pub mod payment_gateway;
pub mod timestamping;

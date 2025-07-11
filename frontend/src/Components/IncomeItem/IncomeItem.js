import React from "react";
import styled from "styled-components";
import { dateFormat } from "../../utils/dateFormat";
import {
  bitcoin,
  book,
  calender,
  card,
  circle,
  clothing,
  comment,
  food,
  freelance,
  medical,
  money,
  piggy,
  stocks,
  takeaway,
  trash,
  tv,
  users,
  yt,
} from "../../utils/Icons";
import Button from "../Button/Button";

function IncomeItem({
  id,
  title,
  amount,
  date,
  category,
  description,
  deleteItem,
  indicatorColor,
  type,
}) {
  const categoryIcon = () => {
    switch (category) {
      case "salary":
        return money;
      case "freelancing":
        return freelance;
      case "investments":
        return stocks;
      case "stocks":
        return users;
      case "bitcoin":
        return bitcoin;
      case "bank":
        return card;
      case "youtube":
        return yt;
      case "other":
        return piggy;
      default:
        return "";
    }
  };

  const expenseCatIcon = () => {
    switch (category) {
      case "education":
        return book;
      case "groceries":
        return food;
      case "health":
        return medical;
      case "subscriptions":
        return tv;
      case "takeaways":
        return takeaway;
      case "clothing":
        return clothing;
      case "travelling":
        return freelance;
      case "other":
        return circle;
      default:
        return "";
    }
  };

  console.log("type", type);

  return (
    <IncomeItemStyled indicator={indicatorColor}>
      <div className="icon">
        {type === "expense" ? expenseCatIcon() : categoryIcon()}
      </div>
      <div className="content">
        <div className="top-row">
          <h5>{title}</h5>
          <div className="btn-con">
            <Button
              icon={trash}
              bPad={"1rem"}
              bRad={"50%"}
              bg={"var(--primary-color"}
              color={"#fff"}
              iColor={"#fff"}
              hColor={"var(--color-green)"}
              onClick={() => deleteItem(id)}
            />
          </div>
        </div>
        <div className="details-row">
          <div className="text">
            <p>₹{amount}</p>
            <p>
              {calender} {dateFormat(date)}
            </p>
            <p>
              {comment}
              {description}
            </p>
            <p>
              <strong>Category:</strong> {category}
            </p>
          </div>
        </div>
      </div>
    </IncomeItemStyled>
  );
}

const IncomeItemStyled = styled.div`
  background: #fcf6f9;
  border: 2px solid #ffffff;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  color: #222260;
  position: relative;
  .icon {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #ffffff;
    i {
      font-size: 2.6rem;
    }
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    .top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      h5 {
        font-size: 1.3rem;
        padding-left: 2rem;
        position: relative;
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 50%;
          background: ${(props) => props.indicator};
        }
      }
      .btn-con {
        margin-left: 1rem;
        position: static;
      }
    }
    .details-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
      p {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--primary-color);
        opacity: 0.8;
      }
    }
  }

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.7rem;
    .icon {
      width: 60px;
      height: 60px;
      margin-bottom: 0.5rem;
    }
    .content {
      .top-row {
        flex-direction: row;
        align-items: center;
        h5 {
          font-size: 1rem;
          padding-left: 1.2rem;
        }
      }
      .details-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
        p {
          font-size: 0.95rem;
        }
      }
    }
  }

  @media (max-width: 400px) {
    padding: 0.4rem;
    .icon {
      width: 40px;
      height: 40px;
    }
    .content {
      .top-row h5 {
        font-size: 0.9rem;
      }
    }
  }
`;

export default IncomeItem;

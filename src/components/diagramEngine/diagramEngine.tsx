import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DiagramInterface,
  InOutParam,
  NodeBlock,
} from "../../interfaces/diagram";
import { DIAGRAM_UPDATE } from "../../redux/constants/actions";
import "./diagramEngine.scss";

export const DiagramEngine = () => {
  let diagrams = useSelector(
    (state: { diagrams: DiagramInterface }) => state.diagrams
  );
  const dispatch = useDispatch();
  const [allInOutButtons, setAllInOutButtons] = useState<InOutButton[]>([]);
  interface inOut {
    in: (JSX.Element | null)[];
    out: (JSX.Element | null)[];
  }
  interface InOutButton {
    id: string;
    x: number;
    y: number;
  }

  const DiagramNode = ({ currentNode }: { currentNode: NodeBlock }) => {
    const [node, setNode] = useState(currentNode);
    const [moveBlock, setMoveBlock] = useState<null | {
      block: string | null;
      positionX: number;
      positionY: number;
      offsetX: number;
      offsetY: number;
    }>(null);

    const InOut = ({
      inOutParam,
      nodeType,
      block_type,
    }: {
      inOutParam: InOutParam;
      nodeType: string;
      block_type: string;
    }) => {
      const buttonRef = useRef<SVGSVGElement>(null);

      const [value, setValue] = useState(
        inOutParam.value === null ? "" : inOutParam.value
      );

      useCallback(() => {
        const findButton = allInOutButtons.find((item) => {
          return item.id === inOutParam.id;
        });
        if (buttonRef.current && findButton) {
          setAllInOutButtons(() => {
            return allInOutButtons.map((item) => {
              if (item.id === inOutParam.id && buttonRef && buttonRef.current) {
                return {
                  id: inOutParam.id,
                  x: buttonRef.current.getBoundingClientRect().x,
                  y: buttonRef.current.getBoundingClientRect().y,
                };
              } else {
                return item;
              }
            });
          });
        } else {
          setAllInOutButtons((state) => {
            if (buttonRef && buttonRef.current) {
              const oldState = state;
              oldState.push({
                id: inOutParam.id,
                x: buttonRef.current.getBoundingClientRect().x,
                y: buttonRef.current.getBoundingClientRect().y,
              });
              return oldState;
            } else {
              return state;
            }
          });
        }
      }, [buttonRef, inOutParam.id]);

      if (inOutParam) {
        return (
          <div className="input__container">
            <div className="name">{inOutParam.name}</div>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={nodeType !== "StringNode"}
              hidden={block_type !== "variable"}
            />
            <svg height="15" width="15" id={inOutParam.id} ref={buttonRef}>
              <circle cx="7.5" cy="7.5" r="6" fill="#69aba9" />
            </svg>
          </div>
        );
      } else {
        return null;
      }
    };

    let items: inOut = useMemo(() => {
      return {
        in: [],
        out: [],
      };
    }, []);

    if (node) {
      for (let i = 0; i < node.in_parameters.length; i++) {
        items.in.push(
          <InOut
            key={i}
            inOutParam={node.in_parameters[i]}
            nodeType={node.type}
            block_type={node.block_type}
          />
        );
      }
      for (let i = 0; i < node.out_parameters.length; i++) {
        items.out.push(
          <InOut
            key={i}
            inOutParam={node.out_parameters[i]}
            nodeType={node.type}
            block_type={node.block_type}
          />
        );
      }
    }

    const moveBlockActivation = useCallback(
      (e: React.MouseEvent) => {
        setMoveBlock({
          block: e.currentTarget.getAttribute("data-id"),
          positionX: e.clientX,
          positionY: e.clientY,
          offsetX: e.clientX - node._x,
          offsetY: e.clientY - node._y,
        });
      },
      [node]
    );

    const removeMoveBlockActivation = useCallback(() => {
      const newNodes = diagrams.nodes.map((item) => {
        if (item.id === node.id) {
          return node;
        } else {
          return item;
        }
      });
      dispatch({
        type: DIAGRAM_UPDATE,
        payload: {
          ...diagrams,
          nodes: newNodes,
        },
      });
      setMoveBlock(null);
    }, [node]);

    const moveBlockUpdate = useCallback(
      (e: MouseEvent) => {
        if (moveBlock !== null) {
          let newX: number;
          let newY: number;
          if (e.clientX - moveBlock.offsetX <= 0) {
            newX = 0;
          } else {
            newX = e.clientX - moveBlock.offsetX;
          }

          if (e.clientY - moveBlock.offsetY <= 0) {
            newY = 0;
          } else {
            newY = e.clientY - moveBlock.offsetY;
          }
          setNode((state) => {
            return {
              ...state,
              _y: newY,
              _x: newX,
            };
          });
        }
      },
      [moveBlock]
    );

    useEffect(() => {
      if (moveBlock !== null) {
        window.addEventListener("mousemove", moveBlockUpdate);
        window.addEventListener("mouseup", removeMoveBlockActivation);
      }
      return () => {
        window.removeEventListener("mousemove", moveBlockUpdate);
        window.removeEventListener("mouseup", removeMoveBlockActivation);
      };
    }, [moveBlock, moveBlockUpdate, removeMoveBlockActivation]);

    return (
      <div
        key={node.id}
        className={"block shadow node__type--" + node.block_type}
        style={{ top: node._y, left: node._x }}
      >
        <div
          className="dragbar"
          data-id={node.id}
          onMouseDown={moveBlockActivation}
        >
          {node.friendly_name}
        </div>
        <div className="block__content">
          <div className="params__container">
            <div className="title">{items.in[0] ? "IN" : ""}</div>
            {items.in}
          </div>
          <div className="params__container">
            <div className="title">{items.out[0] ? "OUT" : ""}</div>
            {items.out}
          </div>
        </div>
      </div>
    );
  };

  const NodesRendering = () => {
    let items = [];
    let node = null;
    const memoidItem = useCallback((node: NodeBlock) => {
      return <DiagramNode key={node.id} currentNode={node} />;
    }, []);
    for (let i = 0; i < diagrams.nodes.length; i++) {
      node = diagrams.nodes[i];
      items.push(memoidItem(node));
    }
    return items;
  };

  return <div className="diagram__container">{NodesRendering()}</div>;
};

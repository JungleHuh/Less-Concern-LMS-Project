import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EXAM_CONFIG } from "@/config/board";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function LectureRegisterPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});

  const form = useForm({
    defaultValues: {
      title: "",
      examType: "",
      price: "50000",
      specialties: "",
      description: "",
      curriculum: "",
      achievements: "",
      thumbnail: null,
      videos: [
        {
          title: "",
          description: "",
          file: null,
          fileName: "",
          duration: "",
          order: 1,
        }
      ]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "videos"
  });

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        toast({
          variant: "destructive",
          title: "오류",
          description: "썸네일 이미지 크기는 5MB를 초과할 수 없습니다."
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = async (event, index) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) { // 500MB 제한
        toast({
          variant: "destructive",
          title: "오류",
          description: "동영상 크기는 500MB를 초과할 수 없습니다."
        });
        return;
      }

      // 비디오 메타데이터 로드
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function() {
        const duration = Math.round(video.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        form.setValue(`videos.${index}.duration`, formattedDuration);
        form.setValue(`videos.${index}.fileName`, file.name);
        window.URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(file);

      // 파일 정보 저장
      form.setValue(`videos.${index}.file`, file);

      // 업로드 진행률 시뮬레이션 (실제 구현 시에는 API 응답으로 대체)
      setUploadProgress(prev => ({ ...prev, [index]: 0 }));
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = (prev[index] || 0) + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
          }
          return { ...prev, [index]: Math.min(newProgress, 100) };
        });
      }, 500);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      
      // 기본 데이터 추가
      Object.keys(data).forEach(key => {
        if (key !== 'thumbnail' && key !== 'videos') {
          formData.append(key, data[key]);
        }
      });
      
      // 썸네일 추가
      const thumbnailFile = document.querySelector('input[name="thumbnail"]').files[0];
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      // 비디오 파일들 추가
      data.videos.forEach((video, index) => {
        if (video.file) {
          formData.append(`videos[${index}][file]`, video.file);
          formData.append(`videos[${index}][title]`, video.title);
          formData.append(`videos[${index}][description]`, video.description);
          formData.append(`videos[${index}][order]`, index + 1);
        }
      });

      // API 호출 부분
      // const response = await registerLectureService(formData);

      toast({
        title: "등록 완료",
        description: "강의가 등록되었습니다. 검토 후 공개됩니다."
      });
      navigate(`/lecture/${data.examType}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "오류",
        description: error.message || "강의 등록에 실패했습니다."
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>강의 등록</CardTitle>
          <CardDescription>
            새로운 강의를 등록하기 위한 정보를 입력해주세요.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-6">
              {/* 기존 필드들... */}

              {/* 동영상 업로드 섹션 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>강의 동영상</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({
                      title: "",
                      description: "",
                      file: null,
                      fileName: "",
                      duration: "",
                      order: fields.length + 1,
                    })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    동영상 추가
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id}>
                      <CardContent className="pt-6 space-y-4">
                        {/* 동영상 제목 */}
                        <FormField
                          control={form.control}
                          name={`videos.${index}.title`}
                          rules={{ required: "동영상 제목을 입력해주세요" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>동영상 제목</FormLabel>
                              <FormControl>
                                <Input placeholder="예: 1강 - 재무회계 기초" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* 동영상 설명 */}
                        <FormField
                          control={form.control}
                          name={`videos.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>동영상 설명</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="동영상에 대한 간단한 설명을 입력해주세요"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* 파일 업로드 */}
                        <div className="space-y-2">
                          <Label>동영상 파일</Label>
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "relative w-full h-24 border-2 border-dashed rounded-lg",
                              "flex items-center justify-center",
                              form.watch(`videos.${index}.fileName`) && "border-primary"
                            )}>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => handleVideoChange(e, index)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              {form.watch(`videos.${index}.fileName`) ? (
                                <div className="text-center">
                                  <p className="font-medium">{form.watch(`videos.${index}.fileName`)}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {form.watch(`videos.${index}.duration`)}
                                  </p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center text-muted-foreground">
                                  <Upload className="w-8 h-8 mb-2" />
                                  <p className="text-sm">동영상을 업로드하세요</p>
                                  <p className="text-xs">최대 500MB</p>
                                </div>
                              )}
                            </div>
                            
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => remove(index)}
                              className="flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {/* 업로드 진행률 */}
                          {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
                            <div className="space-y-1">
                              <Progress value={uploadProgress[index]} />
                              <p className="text-sm text-muted-foreground text-right">
                                {uploadProgress[index]}%
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                취소
              </Button>
              <Button type="submit">강의 등록하기</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}